import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';
import { POSITION_STEP_DEFAULT } from '../engine/Interaction';
import { InfoIco } from '../../Styled';

const SKIP_CINEMATIC = false;

export default class IntroStep extends Step {
    key = StepLabels[StepEnum.Intro];
    id = StepEnum.Intro;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
    
        this.setTitleHoverView("The Rabbit");
        this.setContentHoverView(
            <>
                <ul>
                    <li>Weight <span className="mark">1,2 - 2kg</span></li>
                    <li>Size <span className="mark">20 - 40cm</span></li>
                    <li>Life expectancy <span className="mark">8 - 12 years</span></li>
                    <li>Number of pups per litter <span className="mark">4 - 8 rabbits</span></li>
                    <div className="sub"><InfoIco color="gray" /> <span className='vert-ico'>Differs depending on breeds.</span></div>
                </ul>

                <Map>
                    <BackMap />
                    <ContentMap
                        initial={{ scale: 5, y: "0%" }}
                        animate={{ scale: 1.7, y: "23%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    >
                        <motion.img
                            src="./world_map_rabbit.png"
                            className='map'
                        />
                        <motion.img
                            src="./world_map_rabbit_hover.png"
                            className='hover'
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />
                    </ContentMap>
                </Map>
                <div className="sub gray_light"><InfoIco color="gray_light" /> <span className='vert-ico'>Native to Europe, North Africa and Southwest Asia.</span></div>
            </>
        );
        this.setScreenHoverView(undefined);
        this.setFooterHoverView(undefined);

        if (!SKIP_CINEMATIC) {
            this.cameraManager.setCameraPosition(3.4, 0.8, -10.4);
            await this.introCinematic();
            this._();
        } else {
            this.setPositionDefault()
        }

        setTimeout(() => {
            this._();
            this.setRabbitAnimation(
                { name: RabbitAnimation.IDLE03, loop: false },
                { name: RabbitAnimation.IDLE01, loop: true }
            )
        }, 2000);
        this.openHoverView();
    }

    async introCinematic() {
        return new Promise(async (resolve) => {
            this.closeHoverView();

            const tween1 = new TWEEN.Tween(this.cameraManager.camera.position)
                .to(new THREE.Vector3(1.7, 0.8, -4.6), 2000)
                .onStart(() => {
                    this.setRabbitAnimation({ name: RabbitAnimation.IDLE04, loop: false }, { name: RabbitAnimation.IDLE01, loop: true }, true);
                });
            const tween2 = new TWEEN.Tween(this.cameraManager.camera.position)
                .to(new THREE.Vector3(1.7, 1.8, -4.6), 1000);
            const tween3 = new TWEEN.Tween(this.cameraManager.camera.position)
                .to(POSITION_STEP_DEFAULT, 2000)
                .delay(700)
                .onComplete(() => {
                    resolve(true);
                });

            tween1.chain(tween2);
            tween2.chain(tween3);
            tween1.start();
        });
    }
}

const Map = styled.div`
    border: 1px solid #ffffff57;
    border-radius: 12px;
    margin-top: 33px;
    background: #0000003b;
    position: relative;
    overflow: hidden;

    & img {
        max-height: 320px;
        max-width: 80%;
        width: auto !important;
        margin-left: 50% !important;
        transform: translateX(-50%);
    }
    & img.hover {
        position: absolute;
        left: 0;
        top: 0;
    }
    & img.map {
        opacity: 0.7;
    }
`
const BackMap = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("./bg_overlay.png");
    background-size: 310px;
    animation: backgroundScroll 30s linear infinite;
    @keyframes backgroundScroll {
        0% {
            background-position: 0% 0%;
        }
        100% {
            background-position: -100% -100%;
        }
    }
`
const ContentMap = styled(motion.div)`
    
`