// import Assets from './core/Assets';
import {
    BaseMesh,
    Camera,
    Line,
    Plane,
    Box,
    Cube,
    Sphere,
    Cylinder,
    Grid
} from './entities';

import Audio from './audio/Audio';
import AmbientSound from './audio/AmbientSound';
import BackgroundSound from './audio/BackgroundSound';
import DirectionalSound from './audio/DirectionalSound';
import Sound from './audio/Sound';

//import * as THREE from 'three';
import {
    Vector3,
} from 'three';
import BaseScene, { author } from './core/BaseScene';

import Universe from './core/Universe';
import Color from './lib/Color';

import util from './lib/util';
import * as math from './lib/math';
import * as strings from './lib/strings';
import * as uuid from './lib/uuid';
import * as workers from './lib/workers';

import Stats from './core/Stats';
import Config from './core/config';
import Router from './router/Router';
import Scene from './core/Scene';
import Scripts from './scripts/Scripts';
import Controls from './controls/Controls';
import Physics from './physics/physics';

import * as store from './store';
import { Provider, connect } from 'inferno-redux';

import * as constants from './lib/constants';
import * as functions from './lib/functions';

import BaseScript from './scripts/BaseScript';

import Input from './core/input/Input';

import AmbientLight from './lights/AmbientLight';
import SunLight from './lights/SunLight';
import PointLight from './lights/PointLight';
import SpotLight from './lights/SpotLight';
import HemisphereLight from './lights/HemisphereLight';

import LightLoader from './loaders/LightLoader';
import MeshLoader from './loaders/MeshLoader';

import Atmosphere from './fx/materials/Atmosphere';
import Mirror from './fx/materials/Mirror';
import Ocean from './fx/materials/Ocean';

// import Clouds from './fx/particles/Clouds';
// import Rain from './fx/particles/Rain';

import * as Partykals from 'mage-engine.particles';

import Skybox from './fx/scenery/Skybox';

import Shader from './fx/shaders/Shader';

import Particles, { PARTICLES } from './fx/particles/Particles';

import ParticlEmitter from './fx/particles/ParticleEmitter';

import Images from './images/Images';
import Models from './models/Models';
//import Shaders from './fx/shaders/Shaders';
import PostProcessing from './fx/postprocessing/PostProcessing';

export {
    author,
    BaseMesh,
    BaseScene,

    Config,
    Scene,
    Universe,
    Scripts,
    Router,

    store,
    Provider,
    connect,

    Controls,

    Images,
    Models,
    // Shaders,
    Audio,
    PostProcessing,
    Particles,
    PARTICLES,
    ParticlEmitter,
    Partykals,
    Physics,

    MeshLoader,
    LightLoader,

    BaseScript,

    Input,

    Line,
    Plane,
    Box,
    Cube,
    Cylinder,
    Sphere,
    Grid,
    //AnimatedMesh,
    //ShaderMesh,
    Camera,

    Sound,
    AmbientSound,
    BackgroundSound,
    DirectionalSound,

    AmbientLight,
    SunLight,
    PointLight,
    SpotLight,
    HemisphereLight,

    Atmosphere,
    Mirror,
    Ocean,

    Skybox,

    Shader,

    Color,
    Vector3,
    util,
    math,
    strings,
    uuid,
    workers,
    constants,
    functions,
    Stats
};