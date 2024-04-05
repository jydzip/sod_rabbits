import * as THREE from 'three';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import RabbitSvg from '../../RabbitSvg';
import styled from 'styled-components';
import { InstructionMove } from '../objects/Rabbit';
import { delay } from '../engine/Interaction';
import { motion } from 'framer-motion';
import { InfoIco, capitalize } from '../../Styled';


export default class AStep extends Step {
    key = StepLabels[StepEnum.A];
    id = StepEnum.A;

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
        this.stades[3] = {
            play: this.stade3.bind(this),
            stop: this.stade3_stop.bind(this),
        };
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Behavior & Characteristics");

        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        // this.cameraManager.setCameraPosition(13, 9, -29);
        this.resetContent();
        this.setFooterHoverView(
            <>
            <HeadsTitle>Communication of the rabbit</HeadsTitle>
            <Heads>
                <Head>
                    <img src='head_1.png' />
                    <span>Curious</span>
                </Head>
                <Head>
                    <img src='head_2.png' />
                    <span>Alert</span>
                </Head>
                <Head>
                    <img src='head_3.png' />
                    <span>Relaxed</span>
                </Head>
                <Head>
                    <img src='head_4.png' />
                    <span>Nervous</span>
                </Head>
                <Head>
                    <img src='head_5.png' />
                    <span>Sleepy</span>
                </Head>
            </Heads>
            </>
        );
        this.setScreenHoverView(undefined);
        this._();
        await this.circleMove();
        this._();
        await delay(1500);
        this._();
    }
    stop() {
        this.smc.seedScene.rabbit.setParsleyVisible(false);
    }

    private resetContent() {
        this.setContent("", (
            <>
                <div className="sub white"><InfoIco /> <span className='vert-ico'>A shy animal, but very curious.</span></div>
            </>
        ));
    }
    private setContent(part: string, content: JSX.Element = <></>) {
        this.setContentHoverView(
            <>
                <SvgGlobal>
                    <RabbitSvg part={part} />
                </SvgGlobal>
                <Part>{capitalize(part)}</Part>
                {content}
            </>
        )
    }

    stade1() {
        this.setContent("ear", (
            <ul>
                <li>Excellent hearing!</li>
                <li>Regulates body temperature.</li>
            </ul>
        ));
    }
    stade1_stop() {
        this.resetContent();
    }

    stade2() {
        this.setContent("mustache", (
            <ul>
                <li>Moving in the dark.</li>
                <li>To measure the space of an opening.</li>
                <li>Identify the objects, obtacles.</li>
            </ul>
        ));
    }
    stade2_stop() {
        this.resetContent();
    }

    stade3() {
        this.setContent("claw", (
            <ul>
                <li>Powerful jumps~</li>
                <li>Run very fast.</li>
            </ul>
        ));
    }
    stade3_stop() {
        this.resetContent();
    }

    async circleMove() {
        const rabbit = this.smc.seedScene.rabbit;
    
        const startPosition = new THREE.Vector3(0, 0, 0);
        const radius = 5;
        const numSegments = 15;

        const instructions: InstructionMove[] = [];
        const instructions2: InstructionMove[] = [];

        this.smc.seedScene.rabbit.setRotation(new THREE.Euler(0, 6.3, 0));
        instructions.push({ position: new THREE.Vector3(2, 0, 0), rotation: new THREE.Euler(0, 4.5, 0), speed_position: 600, speed_rotation: 400 });

        for (let i = 0; i <= numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;
            const x = startPosition.x + Math.cos(angle) * radius;
            const z = startPosition.z + Math.sin(angle) * radius;
            const position = new THREE.Vector3(x, 0, z);
            const rotation = new THREE.Euler(0, -angle + Math.PI, 0);
            instructions.push({
                position,
                rotation: rotation,
                speed_position: 350,
                speed_rotation: 200
            });
        }
        const startAngleSecondLoop = (numSegments / numSegments) * Math.PI * 2;

        for (let i = 1; i <= numSegments; i++) {
            const angle = startAngleSecondLoop + (i / numSegments) * Math.PI * 2;
            const x = startPosition.x + Math.cos(angle) * radius;
            const z = startPosition.z + Math.sin(angle) * radius;
            const position = new THREE.Vector3(x, 0, z);
            const rotation = new THREE.Euler(0, -angle + Math.PI, 0);
            if (i > 14) {
                instructions2.push({ position, rotation, speed_position: 350, speed_rotation: 200 });
            } else {
                instructions.push({ position, rotation, speed_position: 350, speed_rotation: 200 });
            }
        }
    
        instructions2.push({ position: new THREE.Vector3(3, 0, 2), rotation: new THREE.Euler(0, -11.2, 0), speed_position: 700, speed_rotation: 400 });
        instructions2.push({ position: startPosition, rotation: new THREE.Euler(0, -13, 0), speed_position: 800, speed_rotation: 500 });
        await rabbit.move(instructions);
        await rabbit.move(instructions2, undefined, undefined, true);
    }
}

const SvgGlobal = styled.div`
    width: 100%;
    height: 320px;
    position: relative;
    margin-top: 10px;
`
const Part = styled(motion.div)`
    text-align: center;
    font-size: 26px;
`

const HeadsTitle = styled.div`
    position: absolute;
    transform: rotate(353deg);
    margin-top: -20px;
    margin-left: 55px;
    opacity: 0.8;
`
const Heads = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
`
const Head = styled.div`
    height: 100%;
    text-align: center;
    margin: 0 10px;
    & span {
        display: block;
    }
    & img {
        height: 75%;
        opacity: 0.7;
    }
`