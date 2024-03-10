import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import SeedScene from "../SeedScene";
import Camera from "../engine/Camera";
import { POSITION_STEP_DEFAULT } from "../engine/Interaction";
import Loader from "../engine/Loader";

export enum StepEnum {
    Null = 0,
    Intro,
    Ending
}
export const StepLabels = {
    [StepEnum.Null]: 'Null',
    [StepEnum.Intro]: 'Intro',
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

    setPositionDefault() {
        TWEEN.removeAll();
        this.camera.setCameraPosition(
            POSITION_STEP_DEFAULT.x,
            POSITION_STEP_DEFAULT.y,
            POSITION_STEP_DEFAULT.z
        );
    }

    _play() {
        console.log(`[STEP#${this.id}] Start ${this.key}`);
        this.play()
    }
    play() {}
}