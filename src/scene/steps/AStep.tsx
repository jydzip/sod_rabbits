import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';
import RabbitSvg from '../../RabbitSvg';

export default class AStep extends Step {
    key = StepLabels[StepEnum.A];
    id = StepEnum.A;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Step A");

        const rabbit = this.smc.seedScene.rabbit;
        this.setRabbitPositionDefault();
        this.setContentHoverView(
            <></>
        )
        this.setFooterHoverView(<>
            <RabbitSvg />
        </>);

        rabbit.setAnimation(RabbitAnimation.RUN);
        await rabbit.move(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(0, 4, 0));
        await rabbit.move(new THREE.Vector3(4, 0, 4));
        await rabbit.move(new THREE.Vector3(2, 0, 2));
        await rabbit.move(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(0, -4, 0));
        rabbit.setAnimation(RabbitAnimation.IDLE01);
    }
}