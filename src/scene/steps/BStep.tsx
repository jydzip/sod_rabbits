import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { delay } from '../engine/Interaction';

export default class BStep extends Step {
    key = StepLabels[StepEnum.B];
    id = StepEnum.B;

    constructor(scm: SceneManager) {
        super(scm);
    }
    initStades() {
        this.stades[1] = {
            play: this.stade1.bind(this),
            stop: this.stade1_stop.bind(this),
        };
    }

    async play() {
        this.setPositionDefault();
        this.closeHoverView();
        this.setTitleHoverView("Vision of the rabbit");
        this.setScreenHoverView(undefined);
        this.setFooterHoverView(undefined);

        const rabbit = this.smc.seedScene.rabbit;
        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <>
                <ul>
                    <li>Vision <span className="mark">~360 degrees</span></li>
                    <li>One eye <span className="mark">192 degrees</span></li>
                </ul>
            </>
        )
        this._();
        
        const camera = this.cameraManager.camera;

        const tween = new TWEEN.Tween(camera.position).to(new THREE.Vector3(0, 2.8, -1.35), 800);
        const tween_rotation = new TWEEN.Tween(camera.rotation).to(new THREE.Vector3(camera.rotation.x, 3.1, camera.rotation.z), 800);
        tween.chain(tween_rotation);
        tween.start();
        tween.onComplete(() => {
            this.cameraManager.setIsCameraRabbit(true);
        })
        await delay(1000);
    }
    stade1() {
        this.openHoverView();
    }
    stade1_stop() {
        this.closeHoverView();
    }

    stop() {
        this.cameraManager.setIsCameraRabbit(false);
    }
}