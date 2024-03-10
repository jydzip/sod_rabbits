import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';

export default class EndingStep extends Step {
    key = StepLabels[StepEnum.Ending];
    id = StepEnum.Ending;

    constructor(scm: SceneManager) {
        super(scm);
    }

    play() {
        this.setPositionDefault()

        this.smc.seedScene.rabbit.setAnimation(RabbitAnimation.SLEEP);
    }
}