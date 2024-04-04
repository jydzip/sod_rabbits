import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import styled from 'styled-components';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';
import { delay } from '../engine/Interaction';
import { motion } from 'framer-motion';

const POSITION_FRONT_CAMERA = new THREE.Vector3(1, 0, -4);

export default class CStep extends Step {
    key = StepLabels[StepEnum.C];
    id = StepEnum.C;

    constructor(scm: SceneManager) {
        super(scm);
    }
    initStades() {
        this.stades[1] = {
            play: this.stade1.bind(this),
            stop: this.stade1_stop.bind(this),
        };
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Food");
        this.resetPersil();

        const rabbit = this.smc.seedScene.rabbit;
        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <>
                <FoodVisual>
                    <img src='./rabbit_alimentation.png' />
                    <div className='lines'>
                        <div className='fruit'>
                            <span>Fruit</span>
                            <figure>1%</figure>
                        </div>
                        <div className='granule'>
                            <span>Granule</span>
                            <figure>10%</figure>
                        </div>
                        <div className='vegetal'>
                            <span>Vegetal</span>
                            <figure>10%</figure>
                        </div>
                        <div className='hay'>
                            <span>Hay</span>
                            <figure>80%</figure>
                        </div>
                    </div>
                </FoodVisual>
            </>
        );
        this.setFooterFoods();
        this._();
        await delay(1000);
        this._();
        await this.animationPersil();
    }
    stade1() {
        this.setScreenHoverView(
            <TriggerScreen
                initial={{ background: '#ff00001c' }}
                animate={{ background: '#ff0000e' }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
            >
                <BackTrigger />
                <Trigger
                    initial={{ scale: 0.5, x: "-50%", y: "-50%" }}
                    animate={{ scale: [0.5, 1.2, 1], x: "-50%", y: "-50%" }}
                    transition={{ duration: .3 }}
                >
                    TRIGGER WARNING
                </Trigger>
            </TriggerScreen>
        )
    }
    stade1_stop() {
        this.setScreenHoverView(undefined);
    }

    private resetPersil() {
        const persil = document.getElementById('persil');
        if (!persil) return;
        // @ts-ignore; Exist
        persil.src = './persil.png';
    }

    private async animationPersil() {
        const rabbit = this.smc.seedScene.rabbit;
        const persil = document.getElementById('persil');
        if (!persil) return;
        console.log('PERSIL !');

        await rabbit.move([{ position: POSITION_FRONT_CAMERA, rotation: new THREE.Euler(0, -1, 0), speed_position: 1500, speed_rotation: 800 }], RabbitAnimation.IDLE02, true, true);
        this._();
        await delay(3800);
        this._();

        // @ts-ignore; Exist
        persil.src = './persil_holder.png';
        this.setFooterFoods(true);
        this._();

        this.smc.seedScene.rabbit.setParsleyVisible();
        await this.setRabbitAnimation({ name: RabbitAnimation.EAT, loop: false }, undefined, true,  { name: RabbitAnimation.EAT_PARSLEY, loop: false, hideAfter: this.smc.seedScene.rabbit.parsley });
        this._();
        this.smc.seedScene.rabbit.setParsleyVisible(false);
        this._();
        this.setRabbitAnimationDefault();
        this._();

        await delay(500);
        this._();
    }

    private setFooterFoods(animate = false) {
        let dataAnimation = {
            animate: undefined,
            initial: undefined
        }
        if (animate) {
            dataAnimation['animate'] = { scale: [1.1, 0.9],  };
            dataAnimation['initial'] = { scale: 1 };
        }
        let persil: JSX.Element = (
            <FoodImg>
                <motion.img 
                    initial={dataAnimation.initial}
                    animate={dataAnimation.animate}
                    src='./persil.png'
                    id='persil'
                />
                <span>Parsley</span>
            </FoodImg>
        );

        this.setFooterHoverView(
            <Foods>
                <FoodImg>
                    <img src='./persil.png' />
                    <span>Dandelion leaves</span>
                </FoodImg>
                <FoodImg>
                    <img src='./persil.png' />
                    <span>Chicory</span>
                </FoodImg>
                <FoodImg>
                    <img src='./persil.png' />
                    <span>Zucchini</span>
                </FoodImg>
                {persil}
                <FoodImg>
                    <img src='./persil.png' />
                    <span>Coriander</span>
                </FoodImg>
            </Foods>
        );
    }
}

const TriggerScreen = styled(motion.div)`
    position: fixed;
    width: 100%;
    height: 100%;
    background: #ff00001c;
    z-index: 100;
`
const Trigger = styled(motion.div)`
    font-size: 47px;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    left: 50%;
    top: 50%;
    color: #fff;
    text-shadow: 1.5px 1.5px 0 #871111, 1.5px -1.5px 0 #871111, -1.5px 1.5px 0 #871111, -1.5px -1.5px 0 #871111, 1.5px 0px 0 #871111, 0px 1.5px 0 #871111, -1.5px 0px 0 #871111, 0px -1.5px 0 #871111 !important;
`
const BackTrigger = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("./bg_overlay.png");
    background-size: 500px;
    animation: backgroundScroll 80s linear infinite;
    @keyframes backgroundScroll {
        0% {
            background-position: 0% 0%;
        }
        100% {
            background-position: -100% -100%;
        }
    }
`

const Foods = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`
const FoodImg = styled.div`
    height: 80%;
    width: 200px;
    text-align: center;
    margin: 0 10px;
    & img {
        width: 100%;
    }
`

const FoodVisual = styled.div`
    position: relative;
    height: 100%;
    width: 500px;
    margin: auto;

    & img {
        height: 470px !important;
        margin-left: 0 !important;
        width: auto !important;
    }
    & div div {
        position: absolute;
        width: 100%;
        max-width: 200px;
        padding: 10px;
        box-sizing: border-box;
    }
    & div.hay {
        left: 260px;
        top: 45%;
    }
    & div.vegetal {
        left: 300px;
        top: 26%;
    }
    & div.granule {
        left: 330px;
        top: 13%;
    }
    & div.fruit {
        left: 225px;
        top: 3%;
    }
    & div div:before {
        content: '';
        position: absolute;
        width: 115%;
        height: 70%;
        border: 1px solid;
        margin-left: -22%;
        margin-top: -1px;
        border-left: 0;
        border-top: 0;
    }
    & div span {
        float: right;
        margin-right: 10px;
    }
    & div figure {
        margin: 0;
        display: inline-block;
        position: absolute;
        top: -7px;
        font-size: 15px;
        right: 9px;
        opacity: 0.7;
    }
    & div.lines {
        margin-left: -50px;
        position: absolute;
        height: 470px;
        width: 100%;
        top: 0;
    }
`