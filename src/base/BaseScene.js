import AssetsManager from './AssetsManager';
import Universe from './Universe';
import SceneManager from './SceneManager';
import SceneHelper from './SceneHelper';
import Stats from './Stats';
import MeshLoader from '../loaders/MeshLoader';
import LightLoader from '../loaders/LightLoader';
import PostProcessingEngine from '../fx/postprocessing/PostProcessingEngine';
import Input from './input/Input';
import LightEngine from '../lights/LightEngine';
import ControlsManager from '../controls/ControlsManager';
import { mount, unmount } from '../ui/render';
import {
    EventDispatcher
} from 'three';
import { fetch } from 'whatwg-fetch';
import { getWindow } from './window';

export const author = {
    name: 'Marco Stagni',
    email: 'mrc.stagni@gmail.com',
    website: 'http://mage.studio'
};

export class BaseScene extends EventDispatcher {

    constructor(options) {
        super();

        this.options = options;
        this.name = this.constructor.name;
        this.debug = true;
        this.sceneHelper = new SceneHelper();

        SceneManager.create();
    }

    enableInput = () => {
        Input.enable();
        Input.addEventListener('keyPress', this.onKeyPress);
        Input.addEventListener('keyDown', this.onKeyDown);
        Input.addEventListener('keyUp', this.onKeyUp);
        Input.addEventListener('mouseDown', this.onMouseDown);
        Input.addEventListener('mouseUp', this.onMouseUp);
        Input.addEventListener('mouseMove', this.onMouseMove);
        Input.addEventListener('meshClick', this.onMeshClick);
        Input.addEventListener('meshDeselect', this.onMeshDeselect);
    };

    disableInput = () => {
        Input.disable();
        Input.removeEventListener('keyPress', this.onKeyPress);
        Input.removeEventListener('keyDown', this.onKeyDown);
        Input.removeEventListener('keyUp', this.onKeyUp);
        Input.removeEventListener('mouseDown', this.onMouseDown);
        Input.removeEventListener('mouseUp', this.onMouseUp);
        Input.removeEventListener('mouseMove', this.onMouseMove);
        Input.removeEventListener('meshClick', this.onMeshClick);
        Input.removeEventListener('meshDeselect', this.onMeshDeselect);
    };

    onKeyPress = () => {};
    onKeyDown = () => {};
    onKeyUp = () => {};
    onMouseDown = () => {};
    onMouseUp = () => {};
    onMouseMove = () => {};
    onMeshClick = () => {};
    onMeshDeselect = () => {};
    onStateChange = (state) => {};

    enableUI = (RootComponent, _props) => {
        const props = {
            scene: this,
            ..._props
        };
        mount(RootComponent, props);
    };

    disableUI = () => unmount();

    onCreate() {}
    prepareScene() {}
    onUpdate() {}
    onFailedTest(message, test) {}
    onSuccededTest(message) {}

    parseScene = ({ meshes = [], models = [], lights = [] }, options = {}) => {
        return new Promise((resolve, reject) => {
            if (meshes.length) {
                for (let i in models) {
                    meshes.push(models[i]);
                }
                MeshLoader.load(meshes, options);
            }

            if (lights.length) {
                LightLoader.load(lights, options);
            }

            SceneManager.updateChildren();

            resolve();
        })
    };

    getJSONUrl = () => `assets/scenes/${this.name}.json`;

    loadScene = (url = this.getJSONUrl()) => {
        if (getWindow()) {
            return fetch(url)
                .then(res => res.json())
                .then(this.parseScene)
                .catch(() => Promise.resolve());
        }
        return Promise.resolve();
    };

    preload = (url = this.getJSONUrl()) => this.loadScene(url);

    onResize = () => SceneManager.onResize();

    render = () => {
        const dt = SceneManager.clock.getDelta();

        SceneManager.render(dt);
        PostProcessingEngine.render(dt);
        this.onUpdate(dt);
        SceneManager.update(dt);
        AssetsManager.update(dt);
        Stats.update(dt);
        ControlsManager.update(dt);

        requestAnimFrame(this.render.bind(this));
    }

    init = () => {
        PostProcessingEngine.init();
        Stats.init();

        this.render();

        if (this.onCreate instanceof Function) {
            this.onCreate();
        } else {
            console.log("[Mage] Something wrong in your onCreate method");
        }
    };

    dispose = () => {
        // how do we make this stop running
        // we need to kill the scene somehow
        // stop rendering the ui if it's enabled
        this.disableInput();
        this.disableUI();
        Universe.bigfreeze();
        SceneManager.dispose();
    };

    load = () => {
        if (!(typeof this.progressAnimation == "function")) {
            this.progressAnimation = (callback) => callback();
        }
        this.progressAnimation(this.init);
    };

    toJSON() {
        return {
            ...LightEngine.toJSON(),
            ...Universe.toJSON()
        };
    }

}

export default BaseScene;
