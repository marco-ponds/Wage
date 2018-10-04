import Manager from './Manager';
import Universe from './Universe';
import SceneManager from './SceneManager';
import Camera from '../entities/Camera';
import util from './util';
import {
    Clock,
    Scene,
    WebGLRenderer,
    PCFSoftShadowMap
} from 'three';

export const version = '0.0.83';
export const author = {
    name: 'Marco Stagni',
    email: 'mrc.stagni@gmail.com',
    website: 'http://mage.studio'
};

export class App {

    constructor() {

        this.log_types = {
    		"e" : "error",
    		"w" : "warn",
    		"i" : "info"
    	};

        //util
        const DEFAULT_HEIGHT = 600;
        const DEFAULT_WIDTH = 800;
        const DEFAULT_RATIO = DEFAULT_WIDTH / DEFAULT_HEIGHT;

        this.config = Object.assign({
    		h : window ? window.innerHeight : DEFAULT_HEIGHT,
    		w : window ? window.innerWidth : DEFAULT_WIDTH,
    		ratio : window ? (window.innerWidth/window.innerHeight) : DEFAULT_RATIO,
    		frameRate : 60,

    		camera : {
    			//handling useful informations about our camera.
    			fov : 75,
    			near : 0.1,
    			far : 100
    		}
    	}, config);

    	//importing libraries
    	this.threeLib = undefined;

    	//scnee parameters
        this.camera = undefined;
        this.user = undefined;
        this.scene = undefined;
        this.renderer= undefined;
        this.clearColor = 0x000000;

    	//debug mode
        this.debug = true;

        //CLOCK!
        this.clock = new Clock();

        //window and mouse variables
        this.mouseX = 0;
        this.mouseY = 0;
        this.zoom = 0;

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.CAMERA_MAX_Z = 1000;
        this.CAMERA_MIN_Z = 250;

        // creating manager
        this.manager = new Manager();
        SceneManager.setConfig(this.config);

        // registering listener for events from parent
        window.addEventListener("onmessage", this.onMessage, false);
        window.addEventListener("message", this.onMessage, false);
        window.addEventListener('resize', this.onResize);
    }

    set clearColor(value) {
        SceneManager.setClearColor(value);
    }

    //onCreate method, ovveride to start creating stuff
    onCreate() {}

    //this methods helps you loading heavy stuff
    preload(callback) {
        callback();
    }

    //do stuff before onCreate method( prepare meshes, whatever )
    prepareScene() {}

    //this is what happens during game loading, the progress animation
    progressAnimation(callback) {
        if ($) {
            $('#loader').animate({"opacity" : "0", "margin-top" : "250px"}, 1000 , function () {
                $('#loader').remove();
                $('body').animate({backgroundColor : "#fff"}, 200 , callback);
            });
        } else {
            callback();
        }

    }

    //needed if user wants to add a customRender method
    _render() {}

    //setupleap motion device
    setUpLeap() {}

    //leap motion socket connected
    onLeapSocketConnected() {}

    //leap motion device connected
    onLeapDeviceConnected() {}

    //leap motion device disconnected
    onLeapDeviceDisconnected() {}

    // window Resized
    onResize() {
        this.config.h = window.innerHeight;
        this.config.w = window.innerWidth;
        this.config.ratio = this.config.w / this.config.h;

        SceneManager.onResize(this.config);
    };

    render() {
        this.manager.update();
        // M.control.update();
        this._render();
        SceneManager.update();

        requestAnimFrame(this.render.bind(this));

    }

    init() {
        if (window && window.keypress) {
            this._keylistener =  new window.keypress.Listener();
        }

        SceneManager.create();
        // M.control.init();
        this.render();

        if (this.onCreate instanceof Function) {
            this.onCreate();
        } else {
            console.log("Something wrong in your onCreate method");
        }
    }

    load() {
        console.log("inside load");
        if (!(typeof this.progressAnimation == "function")) {
            this.progressAnimation = function(callback) {
                console.log("def progressAnimation");
                callback();
            }
        }
        this.progressAnimation(this.init);
    }

    sendMessage(message) {
		parent.postMessage(message, location.origin);
    }

    onMessage() {
        const origin = event.origin || event.originalEvent.origin;
        if (origin !== location.origin)
            return;

    }

    onkey(key, callback) {
        if (this._keylistener) {
            this._keylistener.simple_combo(key, callback);
        }
    }

    //utilities methods
    log() {
    	if (this.debug) {
    		if (arguments.length>1) {
    			if (arguments[1] in this.log_types) {
    				console[this.log_types[arguments[1]]](arguments[0]);
    			} else {
    				console.log(arguments[0]);
    			}
    		} else {
    			console.log(arguments[0]);
    		}
    	}

    }

    onDocumentMouseWheel(event) {

    	event.preventDefault();
    	this.zoom = event.wheelDelta * 0.05;
    	this.camera.object.position.z += this.zoom;

    }

    onDocumentMouseMove(event) {

    	this.mouseX = event.clientX - this.windowHalfX;
    	this.mouseY = event.clientY - this.windowHalfY;

    }

    onDocumentTouchStart(event) {

    	if (event.touches.length === 1) {

    		event.preventDefault();

    		this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
    		this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY;

    	}
    }

    onDocumentTouchMove(event) {

    	if (event.touches.length === 1) {

    		event.preventDefault();

    		this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
    		this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY;

    	}

    }

    //keyup event
    keyup(event) {}

    //keydown event
    keydown(event) {}

    //handling failed tests
    onFailedTest(message, test) {}

    //handling succesful tests
    onSuccededTest(message) {}

}

export default App;

export const start(className) {
    if (typeof className === 'function') {
        window.app = new className();
    } else {
        window.app = new App();
    }

    util.start();
    util.checker.start(
        app.onSuccededTest,
        app.onFailedTest
    ).then(app.preload(() => {
        app.manager
            .load()
            .then(() => {
                app.prepareScene();
                app.load();
            })
    }));
}
