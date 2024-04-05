import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { InfoIco } from '../../Styled';

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
                <img src='./enclos.jpg' />
                <div className="sub white"><InfoIco /> <span className='vert-ico'>A rabbit cannot live constantly in a cage!</span></div>
            </>
        );
        this.setFooterHoverView(undefined);
        this.setScreenHoverView(undefined);
    }
}