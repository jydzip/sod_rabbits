import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { delay } from '../engine/Interaction';
import Vision1 from '../objects/Vision1';
import Vision2 from '../objects/Vision2';
import Rabbit, { RabbitAnimation } from '../objects/Rabbit';

export default class BStep extends Step {
    key = StepLabels[StepEnum.B];
    id = StepEnum.B;

    vision1?: Vision1;
    vision2?: Vision2;
    rabbitB: Rabbit;
    rabbitC: Rabbit;

    constructor(scm: SceneManager) {
        super(scm);
    }
    initStades() {
        this.stades[1] = {
            play: this.stade1.bind(this),
            stop: this.stade1_stop.bind(this),
        };
        this.stades[2] = {
            play: this.stade2.bind(this),
            stop: this.stade2_stop.bind(this),
        };
    }

    async play() {
        this.setPositionDefault();
        this.closeHoverView();
        this.setTitleHoverView("Vision of the rabbit");
        this.setScreenHoverView(undefined);
        this.setFooterHoverView(undefined);

        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <>
                <ul>
                    <li>Vision <span className="mark">~360 degrees</span></li>
                    <li>Excellent view in the dark.</li>
                    <li>Blink once every <span className="mark">5 - 6 minutes</span></li>
                </ul>
                <Visual>
                    <img src='./view_1.png' className='visual' />
                    <motion.img
                        initial={{ scale: 1.5 }}
                        animate={{ scale: [1.5, 0.8, 1] }}
                        transition={{ duration: .6, repeat: Infinity, repeatDelay: 4 }}
                        src='./view_2.png'
                        className='rabbit'
                    />
                </Visual>
            </>
        )
        this._();

        this.rabbitB = new Rabbit(false);
        await this.rabbitB.init();
        this._();
        //this.rabbitB.initGUI();
        this.rabbitB.setPosition(new THREE.Vector3(-10, 0, -9));
        this.rabbitB.setRotation(new THREE.Euler(0, 5.3, 0));
        this.rabbitB.setAnimation({ name: RabbitAnimation.IDLE01, loop: true });
        this.smc.add(this.rabbitB);

        this._();

        this.rabbitC = new Rabbit(false);
        await this.rabbitC.init();
        this._();
        //this.rabbitC.initGUI();
        this.rabbitC.setPosition(new THREE.Vector3(15, 0, -4));
        this.rabbitC.setRotation(new THREE.Euler(0, 0.7, 0));
        this.rabbitC.scale.set(0.8, 1, 1);
        this.rabbitC.setAnimation({ name: RabbitAnimation.IDLE01, loop: true });
        this.smc.add(this.rabbitC);

        this._();

        this.rabbitB.move([
            { position: new THREE.Vector3(-1, 0, -9), rotation: new THREE.Euler(0, 3.7, 0), speed_position: 1500, delay: 500 }
        ]).then(() => {
            this._();
            this.openHoverView();

            setTimeout(() => {
                this._();
                this.rabbitB.setAnimation(
                    { name: RabbitAnimation.IDLE03, loop: false },
                    { name: RabbitAnimation.IDLE01, loop: true },
                );
            }, 1500);

            this._();

            this.rabbitC.move([
                { position: new THREE.Vector3(13, 0, -7), rotation: new THREE.Euler(0, 0.5, 0), speed_position: 1500, delay: 500 },
                { position: new THREE.Vector3(8, 0, -7), rotation: new THREE.Euler(0, 1.2, 0), speed_position: 1500 }
            ], undefined, undefined, true).then(() => {
                this._();
                setTimeout(() => {
                    this._();
                    this.rabbitB.setAnimation(
                        { name: RabbitAnimation.IDLE02, loop: false },
                        { name: RabbitAnimation.IDLE01, loop: true },
                    );
                }, 1500);
            });
        });

        this._();
        const camera = this.cameraManager.camera;

        const tween = new TWEEN.Tween(camera.position).to(new THREE.Vector3(0, 2.8, -1.35), 800);
        const tween_rotation = new TWEEN.Tween(camera.rotation).to(new THREE.Vector3(camera.rotation.x, 3.1, camera.rotation.z), 800);
        tween.chain(tween_rotation);
        tween.start();
        tween.onComplete(() => {
            this.cameraManager.setIsCameraRabbit(true);
        })
        this._();
        await delay(1000);
        this._();
    }
    stade1() {
        this.closeHoverView();
        if (this.vision1) this.vision1.remove();
        this.vision1 = new Vision1();
        this.vision1._start();
    }
    stade1_stop() {
        this.openHoverView();
        this.vision1._remove();
    }
    stade2() {
        this.closeHoverView();
        if (this.vision2) this.vision2.remove();
        this.vision2 = new Vision2();
        this.vision2._start();
    }
    stade2_stop() {
        this.vision2._remove();
    }

    update(dt: number) {
        if (this.rabbitB) this.rabbitB.update(dt);
        if (this.rabbitC) this.rabbitC.update(dt);
    }
    stop() {
        if (this.rabbitB) this.smc.remove(this.rabbitB);
        if (this.rabbitC) this.smc.remove(this.rabbitC);
        this.cameraManager.setIsCameraRabbit(false);
    }
}

const Visual = styled.div`
    position: relative;
    & img.rabbit {
        position: absolute;
        left: 0;
    }
`