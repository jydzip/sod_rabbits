import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import SeedScene from "../SeedScene";
import Camera from "../engine/Camera";
import { POSITION_STEP_DEFAULT } from "../engine/Interaction";
import Loader from "../engine/Loader";
import { RabbitAnimation } from '../objects/Rabbit';

export enum StepEnum {
    Null = 0,
    Intro,
    A,
    B,
    Ending
}
export const StepLabels = {
    [StepEnum.Null]: 'Null',
    [StepEnum.Intro]: 'Intro',
    [StepEnum.A]: 'A',
    [StepEnum.Ending]: 'Ending'
};

export default class Step {
    public key = StepLabels[StepEnum.Null];
    public id = StepEnum.Null;

    public smc: SceneManager;
    public camera: Camera;
    public loader: Loader;
    public seed: SeedScene;

    constructor(scm: SceneManager) {
        this.smc = scm;
        this.camera = this.smc.getCamera();
        this.loader = this.smc.getLoader();
        this.seed = this.smc.seedScene;
    }

    public setPositionDefault() {
        this.camera.setCameraPosition(
            POSITION_STEP_DEFAULT.x,
            POSITION_STEP_DEFAULT.y,
            POSITION_STEP_DEFAULT.z
        );
    }
    public setRabbitPositionDefault() {
        const position = new THREE.Vector3(0, 0, 0);
        const rotation = new THREE.Vector3(0, 0, 0);
        this.smc.seedScene.rabbit.setPosition(position);
        this.smc.seedScene.rabbit.setRotation(rotation);
    }
    public openHoverView() {
        this.smc.uiManager.openHV();
    }
    public closeHoverView() {
        this.smc.uiManager.closeHV();
    }
    public setTitleHoverView(value: string) {
        this.smc.uiManager.setTitleHV(value);
    }
    public setContentHoverView(element: JSX.Element) {
        this.smc.uiManager.setContentHV(element);
    }
    public setFooterHoverView(element: JSX.Element | null) {
        this.smc.uiManager.setFooterHV(element);
    }

    _play() {
        console.log(`[STEP#${this.id}] Start ${this.key}`);
        TWEEN.removeAll();
        this.play()
    }
    play() {}
}