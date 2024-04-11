import * as THREE from 'three';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { InfoIco } from '../../Styled';
import AnimatedText from '../../AnimatedText';
import Rabbit, { RabbitAnimation } from '../objects/Rabbit';

export default class DStep extends Step {
    key = StepLabels[StepEnum.D];
    id = StepEnum.D;

    rabbitB: Rabbit;
    alreadyMoveB: boolean;

    constructor(scm: SceneManager) {
        super(scm);
        this.alreadyMoveB = false;
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
        this.openHoverView();
        this.setTitleHoverView("Rabbit Domestic");

        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <>
                <Picture1>
                    <img src='./enclos.png' />
                    <AnimatedText text='Interior' className='lg1' />
                    <AnimatedText text='Exterior' className='lg2' />
                </Picture1>
                <div className="sub white"><InfoIco /> <span className='vert-ico'>A rabbit cannot live constantly in a cage!</span></div>
            </>
        );
        this.setFooterHoverView(undefined);
        this.setScreenHoverView(undefined);

        this.rabbitB = new Rabbit(false);
        await this.rabbitB.init();
        this._();
        // this.rabbitB.initGUI();
        this.rabbitB.setPosition(new THREE.Vector3(-15, 0, -6));
        this.rabbitB.setRotation(new THREE.Euler(0, 3.7, 0));
        this.rabbitB.setAnimation({ name: RabbitAnimation.IDLE01, loop: true });
        this.smc.add(this.rabbitB);

        setTimeout(() => {
            this._();
            this.setRabbitAnimation(
                { name: RabbitAnimation.IDLE03, loop: false },
                { name: RabbitAnimation.IDLE01, loop: true }
            )
        }, 2000);
    }
    stade1() {
        this.setScreenHoverView(
            <ToyScreen>
                <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src='wood_house.png'
                    className='house'
                />
            </ToyScreen>
        );
    }
    stade1_stop() {
        this.setScreenHoverView(undefined);
    }

    async stade2() {
        this.setScreenHoverView(
            <ToyScreen>
                <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src='wood_house.png'
                    className='house'
                />

                <motion.img
                    initial={{ opacity: 0, x: 500, rotate: 0 }}
                    animate={{ opacity: 1, x: 0, rotate: 360 }}
                    src='ball_rolling.png'
                    className='ball'
                />
            </ToyScreen>
        );
        this._();
    
        if (!this.alreadyMoveB) {
            this.alreadyMoveB = true;
            await this.rabbitB.move([
                { position: new THREE.Vector3(0, 0, -6), rotation: new THREE.Euler(0, 4.3, 0), speed_position: 1500, delay: 500 }
            ], undefined, undefined, true);
        }
        this._();
    }
    stade2_stop() {
        this.setScreenHoverView(undefined);
    }

    update(dt: number) {
        if (this.rabbitB) this.rabbitB.update(dt);
    }
    stop() {
        this.alreadyMoveB = false;
        if (this.rabbitB) this.smc.remove(this.rabbitB);
    }
}

const Picture1 = styled.div`
    position: relative;
    width: 80%;
    margin: auto;
    margin-top: 20px;
    
    & span {
        position: absolute;
        font-size: 23px;
    }
    & img {
        width: 100% !important;
        margin-left: 0 !important;
    }
    & span.lg1 {
        right: 20%;
        top: 15%;
    }
    & span.lg2 {
        left: 27%;
        bottom: 10%;
    }
`
const ToyScreen = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9;
    & .house {
        position: absolute;
        bottom: 0;
        left: 10%;
        max-width: 30%;
        max-height: 410px;
    }
    & .ball {
        position: absolute;
        bottom: 0;
        right: 10%;
        width: 15%;
    }
`