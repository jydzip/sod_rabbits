import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import SeedScene from "../SeedScene";
import CameraManager from "../engine/CameraManager";
import { POSITION_STEP_DEFAULT } from "../engine/Interaction";
import Loader from "../engine/Loader";
import { InstructionAnimation, RabbitAnimation } from '../objects/Rabbit';
import UIManager from '../engine/UIManager';

export enum StepEnum {
    Null = 0,
    Intro,
    A,
    B,
    C,
    D,
    Ending
}
export const StepLabels = {
    [StepEnum.Null]: 'Null',
    [StepEnum.Intro]: 'Intro',
    [StepEnum.A]: 'A',
    [StepEnum.B]: 'B',
    [StepEnum.C]: 'C',
    [StepEnum.D]: 'D',
    [StepEnum.Ending]: 'Ending'
};

export default class Step {
    public key = StepLabels[StepEnum.Null];
    public id = StepEnum.Null;

    public smc: SceneManager;
    public cameraManager: CameraManager;
    public uiManager: UIManager;
    public loader: Loader;
    public seed: SeedScene;

    public isPlaying: boolean = false;
    public currentStade: number = 0;
    public stades: { [key: number]: {
        'play': () => void,
        'stop': () => void
    } };

    constructor(scm: SceneManager) {
        this.smc = scm;
        this.cameraManager = this.smc.getCameraManager();
        this.uiManager = this.smc.uiManager;
        this.loader = this.smc.getLoader();
        this.seed = this.smc.seedScene;
        this.stades = {};
        this.initStades();
    }
    initStades() {}

    public setPositionDefault() {
        this.cameraManager.setCameraPosition(
            POSITION_STEP_DEFAULT.x,
            POSITION_STEP_DEFAULT.y,
            POSITION_STEP_DEFAULT.z
        );
        this.cameraManager.camera.lookAt(new THREE.Vector3(2, 2, 0));
    }
    public setRabbitPositionDefault() {
        const position = new THREE.Vector3(0, 0, 0);
        const rotation = new THREE.Euler(0, 0, 0);
        this.smc.seedScene.rabbit.setPosition(position);
        this.smc.seedScene.rabbit.setRotation(rotation);
    }
    public setRabbitAnimationDefault() {
        this.smc.seedScene.rabbit.setAnimation({
            name: RabbitAnimation.IDLE01,
            loop: true
        }, undefined, true);
    }
    public async setRabbitAnimation(animation: InstructionAnimation, nextAnimation?: InstructionAnimation, force = false, dualAnimation?: InstructionAnimation) {
        await this.smc.seedScene.rabbit.setAnimation(animation, nextAnimation, force, dualAnimation);
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
    public setScreenHoverView(element: JSX.Element | null) {
        this.smc.uiManager.setScreenHV(element);
    }

    async _play() {
        console.log(`[STEP#${this.id}] Start ${this.key}`);
        TWEEN.removeAll();
        this.isPlaying = true;
        this.currentStade = 0;
        this.setStadeStatus();

        try {
            await this.play();
        } catch (error) {
            if (error instanceof Error && error.message === 'stopped') {
                return;
            } else {
                throw error;
            }
        }
    }
    async play() {}

    _stop() {
        this.isPlaying = false;
        this.stop()
    }
    stop() {}

    public playNextStade() {
        if (Object.keys(this.stades).length < 1) return;
        if (this.currentStade < Object.keys(this.stades).length) {
            if (this.currentStade > 0) this.stades[this.currentStade].stop();
            this.currentStade++;
            if (this.currentStade != 0) this.stades[this.currentStade].play();
            this.setStadeStatus();
        } else {
            console.log("No more stade.");
        }
    }
    public playPreviousStade() {
        if (Object.keys(this.stades).length < 1) return;
        let newCurrentStade = this.currentStade - 1;
        if (newCurrentStade < 0) newCurrentStade = 0;
        if (newCurrentStade == this.currentStade) return;
        if (this.currentStade > 0) this.stades[this.currentStade].stop();
        this.currentStade = newCurrentStade;
        if (this.currentStade != 0) this.stades[this.currentStade].play();
        this.setStadeStatus();
    }
    private setStadeStatus() {
        this.uiManager.setStadeMax(Object.keys(this.stades).length);
        this.uiManager.setStade(this.currentStade);
    }

    public _() {
        if (!this.isPlaying) {
            throw new Error('stopped');
        }
    }
}