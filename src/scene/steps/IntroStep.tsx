import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';
import { POSITION_STEP_DEFAULT } from '../engine/Interaction';

export default class IntroStep extends Step {
    key = StepLabels[StepEnum.Intro];
    id = StepEnum.Intro;

    constructor(scm: SceneManager) {
        super(scm);
    }

    play() {
        this.camera.setCameraPosition(3.4, 0.8, -10.4);

        const tween1 = new TWEEN.Tween(this.camera.camera.position)
            .to(new THREE.Vector3(1.7, 0.8, -4.6), 2000)
            .onStart(() => {
                this.smc.seedScene.rabbit.setAnimation(RabbitAnimation.IDLE04, RabbitAnimation.IDLE01);
            });
        const tween2 = new TWEEN.Tween(this.camera.camera.position)
            .to(new THREE.Vector3(1.7, 1.8, -4.6), 1000);
        const tween3 = new TWEEN.Tween(this.camera.camera.position)
            .to(POSITION_STEP_DEFAULT, 2000)
            .delay(700);

        tween1.chain(tween2);
        tween2.chain(tween3);
        tween1.start();
    }
}