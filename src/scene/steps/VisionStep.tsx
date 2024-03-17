import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import styled from 'styled-components';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { delay } from '../engine/Interaction';

export default class VisionStep extends Step {
    key = StepLabels[StepEnum.Vision];
    id = StepEnum.Vision;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Step Vision");

        const rabbit = this.smc.seedScene.rabbit;
        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <></>
        )
        this._();

        const tween = new TWEEN.Tween(this.camera.camera.position).to(new THREE.Vector3(0.5, 1.9, -2), 1000);
        const tween_rotation = new TWEEN.Tween(this.camera.camera.rotation).to(new THREE.Vector3(-3, 3, 3.1), 1000);
        tween.chain(tween_rotation);
        tween.start();
    }    
}