import * as THREE from 'three';

import BasicLights from './engine/Light';
import Ground from './objects/Ground';
import Rabbit from './objects/Rabbit';
import Sky from './objects/Sky';
import ObjectGroup from './engine/ObjectGroup';


export default class SeedScene extends ObjectGroup {
    private sky: Sky;
    private ground: Ground;
    public rabbit: Rabbit;

    constructor() {
        console.log('[SCENE] Initialization SeedScene')
        super();
    }
    async init() {
        this.sky = new Sky();
        this.ground = new Ground();
        this.rabbit = new Rabbit();
        await this.rabbit.init();
        const lights = new BasicLights();

        this.add(this.sky, this.ground, this.rabbit, lights);
    }

    update(dt: number) {
        // this.rotation.y += 0.0005;
        this.sky.update(dt);
        this.ground.update(dt);
        this.rabbit.update(dt)
    }
}