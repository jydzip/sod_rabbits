import * as THREE from 'three';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import Rabbit, { RabbitAnimation } from '../objects/Rabbit';
import AnimatedText from '../../AnimatedText';

export default class EndingStep extends Step {
    key = StepLabels[StepEnum.Ending];
    id = StepEnum.Ending;

    rabbitB: Rabbit;
    intervalMoveB: NodeJS.Timeout;

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
        this.setRabbitPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Thank You");

        this.setRabbitAnimation({ name: RabbitAnimation.SLEEP, loop: true }, undefined, true);

        this.setContent();
        this.setScreenHoverView(
            <motion.div
                initial={{ opacity: .4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 5, repeatType: "reverse", repeat: Infinity }}
            >
                <BackCard />
            </motion.div>
        );
        this.setFooterHoverView(
            <>
                <CardGithub>
                    <img src='https://avatars.githubusercontent.com/u/159121042?v=4' className="avatar" />
                    <p className='link'>https://github.com/jydzip</p>
                    <img src='./github_logo.png' className="logo" />
                    <CardGithubContent>
                        <p>Repo: <span className="mark">sod_rabbits</span></p>
                        <img src='./ts_logo.png' className="ts" />
                    </CardGithubContent>
                </CardGithub>
                <QRCode>
                    <img src='./qrcode.png' />
                </QRCode>
            </>
        );

        this.rabbitB = new Rabbit(false);
        await this.rabbitB.init();
        this._();
        //this.rabbitB.initGUI();
        this.rabbitB.setRotation(new THREE.Euler(0, 3.7, 0));
        this.rabbitB.setPosition(new THREE.Vector3(-15, 0, -6));
        this.rabbitB.setAnimation({ name: RabbitAnimation.IDLE01, loop: true });
        this.smc.add(this.rabbitB);

        
        this.animateMoveB();
        this.intervalMoveB = setInterval(() => {
            this.animateMoveB();
        }, 8000);
    }
    stade1() {
        this.setContent(1);
    }
    stade1_stop() {
        this.setContent();
    }

    private animateMoveB() {
        this._();
        this.rabbitB.setPosition(new THREE.Vector3(-15, 0, -6));
        this.rabbitB.setRotation(new THREE.Euler(0, 3.7, 0));
        this.rabbitB.move([
            { position: new THREE.Vector3(-12.5, 0, 0), rotation: new THREE.Euler(0, 3.7, 0), speed_position: 700 },
            { position: new THREE.Vector3(-9, 0, 5), rotation: new THREE.Euler(0, 4.0, 0), speed_position: 700 },
            { position: new THREE.Vector3(-4, 0, 10), rotation: new THREE.Euler(0, 4.5, 0), speed_position: 700 },
            { position: new THREE.Vector3(5, 0, 11), rotation: new THREE.Euler(0, 4.8, 0), speed_position: 700 },
            { position: new THREE.Vector3(10, 0, 12), rotation: new THREE.Euler(0, 5.3, 0), speed_position: 700 },
            { position: new THREE.Vector3(15, 0, 10), rotation: new THREE.Euler(0, 5.8, 0), speed_position: 700 },
            { position: new THREE.Vector3(20, 0, 10), rotation: new THREE.Euler(0, 5.8, 0), speed_position: 700 },
        ]);
    }

    private setContent(stade = 0) {
        let stade1Content = <></>;
        if (stade == 1) {
            const text = 'I am available for any questions.';
            const delay = (text.length * 60) / 1000;
            stade1Content = (
                <QuestionLabel>
                    <span className='q'>
                        <AnimatedText text={text} ms={50} />
                        <motion.img
                            initial={{ rotate: "-8deg", opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: [2.5, 0.5, 1] }}
                            transition={{ duration: 0.7, delay: delay }}
                            src='./patpat_yellow.png'
                            className='a'
                        />
                        <motion.img
                            initial={{ rotate: "28deg", opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: [2.5, 0.5, 1] }}
                            transition={{ duration: 0.8, delay: (delay + 0.5) }}
                            src='./patpat_yellow.png'
                            className='b'
                        />
                    </span>
                </QuestionLabel>
            );
        }
        this.setContentHoverView(
            <GlobalEnd>
                <p>
                    <span className='italic'>The rabbit is an intelligent, independent and clean animal, it makes a very good pet friend!</span>
                    <br/>
                    <img src="./rabbit.gif" className='emote' />
                    <br/>
                    {stade1Content}
                </p>
            </GlobalEnd>
        );
    }

    update(dt: number) {
        if (this.rabbitB) this.rabbitB.update(dt);
    }
    stop() {
        if (this.intervalMoveB) clearInterval(this.intervalMoveB);
        if (this.rabbitB) this.smc.remove(this.rabbitB);
    }
}

const CardGithub = styled.div`
    background: #0000004f;
    max-width: 580px;
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    margin: auto;
    text-align: center;
    display: flex;
    align-items: center;
    border: 1px solid #ffffff29;
    border-radius: 10px 25px;
    position: relative;
    margin-top: -35px;
    border-top-color: #ffffff4d;
    border-bottom-width: 5px;

    & img.avatar {
        height: 90%;
        margin-left: 2%;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 3px 3px 0 #5cbbff, -3px -3px 0 #5cbbff, -4px 3px 0 #5cbbff, 4px -2px 0 #5cbbff;
    }
    & img.logo {
        width: 110px;
        position: absolute;
        right: -7px;
        bottom: 13px;
    }
    & img.ts {
        width: 33px;
        position: absolute;
        right: 95px;
        bottom: 13px;
        opacity: 0.8
    }
    & span.mark {
        background: #575757;
        padding: 3px 7px;
        box-sizing: border-box;
        border-radius: 7px;
        font-size: 26px;
        margin: 0 5px;
    }
    & .link {
        position: absolute;
        bottom: 0;
        font-family: cursive;
        margin-left: -23px;
    }
`
const CardGithubContent = styled.div`
    flex: 1;
    margin-left: 15px;
    height: 100%;
    font-size: 24px;
`
const QRCode = styled.div`
    width: 200px;
    position: absolute;
    right: 10px;
    bottom: 11px;
    height: 200px;
    background: #10101042;
    border-radius: 0 0 30px 0;
    & img {
        width: 100%;
    }
`
const BackCard = styled.div`
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

const GlobalEnd = styled.div`
    text-align: center;

    & img.emote {
        width: 70px !important;
        margin-left: 100% !important;
        transform: translateX(-90px);
    }
`
const QuestionLabel = styled.div`
    font-size: 39px;
    color: #f4ffb4;
    margin-top: 20px;

    & span.q {
        position: relative;
    }
    & img {
        position: absolute;
        margin-left: 0 !important;
    }
    & img.a {
        width: 40px !important;
        left: -8px;
        top: -36px;
    }
    & img.b {
        width: 32px !important;
        right: -20px;
        bottom: -33px;
    }
`