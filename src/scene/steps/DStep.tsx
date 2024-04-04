import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";

export default class DStep extends Step {
    key = StepLabels[StepEnum.D];
    id = StepEnum.D;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Rabbit Domestic");

        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <>
                
            </>
        );
        this.setFooterHoverView(undefined);
        this.setScreenHoverView(undefined);
    }
}