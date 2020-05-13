import { EventDispatcher } from "three";
import util, { FEATURES } from '../../lib/util';
import { gamepadDisconnected, gamepadConnected } from "../../store/actions/input";
import { dispatch } from '../../store/Store';

const GAMEPAD_CONNECTED_EVENT = 'gamepadconnected';
const GAMEPAD_DISCONNECTED_EVENT = 'gamepaddisconnected';

export const X_AXES_CHANGE_EVENT = 'xAxesChange';
export const Y_AXES_CHANGE_EVENT = 'yAxesChcange';
export const AXES_CHANGE_EVENT = 'axesChange';

export const BUTTON_PRESSED_EVENT = 'gamepadButtonPressed';
export const BUTTON_RELEASED_EVENT = 'gamepadButtonReleased';

export const isValidGamepad = gamepad => !!gamepad;

export const getConnectedGamepads = () => {
    const list = navigator.getGamepads ?
        navigator.getGamepads() :
        (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])

    if (typeof list === 'array') return list;

    let gamepads = [];
    for (let gamepad of navigator.getGamepads()) {
        if (isValidGamepad(gamepad)) {
            gamepads.push(gamepad);
        }
    }

    return gamepads;
};

export const parseButton = (button, index)=> {

    if (typeof button === 'number') {
        return {
            pressed: button === 1.0,
            value: button,
            index
        }
    };

    return {
        pressed: button.pressed,
        value: button.value,
        index
    }
}

export default class Gamepad extends EventDispatcher {

    constructor() {
        super();
        this.enabled = false;
        this.gamepads = {};

        // this.evaluateGamepads = debounce(evaluateGamepads, 2000, false, this).bind(this);
    }

    reset() {
        this.enabled = false;
        this.gamepads = {};
    }

    enable() {
        if (util.isFeatureSupported(FEATURES.GAMEPADAPI)) {
            this.enabled = true;
            window.addEventListener(GAMEPAD_CONNECTED_EVENT, this.onGamepadConnected);
            window.addEventListener(GAMEPAD_DISCONNECTED_EVENT, this.onGamepadDisconnected);
        }
    }

    disable() {
        this.reset();
        window.removeEventListener(GAMEPAD_CONNECTED_EVENT, this.onGamepadConnected);
        window.removeEventListener(GAMEPAD_DISCONNECTED_EVENT, this.onGamepadDisconnected);
    }

    transformGamepdasForEvent = () => (
        Object
            .keys(this.gamepads)
            .reduce((acc, index) => {
                const gamepad = this.gamepads[index];

                acc[index] = {
                    index: gamepad.index,
                    connected: gamepad.connected,
                    timestamp: gamepad.timestamp,
                    id: gamepad.id,
                    mapping: gamepad.mapping
                }
                
                return acc;
            }, {})
    )

    onGamepadConnected = (e) => {
        this.addGamepad(e.gamepad);
        dispatch(gamepadConnected(this.transformGamepdasForEvent()));
    }
    onGamepadDisconnected = (e) => {
        this.removeGamepad(e.gamepad);
        dispatch(gamepadDisconnected(this.transformGamepdasForEvent()));
    }

    addGamepad(gamepad) { this.gamepads[gamepad.index] = gamepad; }
    removeGamepad(gamepad) { delete this.gamepads[gamepad.index]; }
    updateGamepadWithIndex(index, gamepad) { this.gamepads[index] = gamepad; }
    hasGamepadWithIndex(index) { return !!(index in this.gamepads); }

    evaluateGamepads = (previousGamepads) => {
        Object
            .keys(this.gamepads)
            .forEach(index => {
                const gamepad = this.gamepads[index];
                const { buttons: previousButtons } = previousGamepads[index];
    
                this.evaluateButtonsChange(previousButtons, gamepad);
                this.evaluateAxesChange(gamepad);
            });
    };

    evaluateButtonsChange = (previousButtons, gamepad) => {
        gamepad.buttons.forEach((button, index) => {
            const current = parseButton(button, index);
            const previous = parseButton(previousButtons[index], index);

            if (current.pressed) {
                this.dispatchEvent({
                    type: BUTTON_PRESSED_EVENT,
                    button: current,
                    gamepad
                })
            } else if (previous.pressed) {
                this.dispatchEvent({
                    type: BUTTON_RELEASED_EVENT,
                    button: current,
                    gamepad
                })
            }
        });
    };

    evaluateAxesChange = (gamepad) => {
        const isMoving = (value) => Math.abs(value) !== 0;
        let joystick = 0;
        const axes = gamepad.axes;

        for (let i = 0; i<axes.length; i+= 2) {
            let x = parseFloat(axes[i].toFixed(3));
            let y = parseFloat(axes[i+1].toFixed(3));

            if (isMoving(x) || isMoving(y)) {
                this.dispatchEvent({
                    type: AXES_CHANGE_EVENT,
                    value: { x, y },
                    gamepad,
                    joystick
                })
            }
            joystick++;
        }
    }

    updateGamepads() {
        getConnectedGamepads()
            .filter(isValidGamepad)
            .forEach(gamepad => {
                if (!this.hasGamepadWithIndex(gamepad.index)) {
                    this.addGamepad(gamepad);
                } else {
                    this.updateGamepadWithIndex(gamepad.index, gamepad);
                }
            });
    }

    update() { 
        if (this.enabled) {
            const previous = { ...this.gamepads };
            this.updateGamepads();
            this.evaluateGamepads(previous);
        }
    }
}