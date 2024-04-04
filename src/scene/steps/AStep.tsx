import * as THREE from 'three';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import RabbitSvg from '../../RabbitSvg';
import styled from 'styled-components';
import { InstructionMove } from '../objects/Rabbit';
import { delay } from '../engine/Interaction';
import { motion } from 'framer-motion';


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
        this.setContent("");
        this.setFooterHoverView(undefined);
        this._();
        await this.circleMove();
        this._();
        await delay(1500);

        this._();
    }
    stop() {
        this.smc.seedScene.rabbit.setParsleyVisible(false);
    }

    private setContent(part: string) {
        this.setContentHoverView(
            <>
                <SvgGlobal>
                    <RabbitSvg part={part} />
                </SvgGlobal>
                <Part>{part}</Part>
            </>
        )
    }

    stade1() {
        this.setContent("ear");
    }
    stade1_stop() {
        this.setContent("");
    }

    stade2() {
        this.setContent("mustache");
    }
    stade2_stop() {
        this.setContent("");
    }

    stade3() {
        this.setContent("claw");
    }
    stade3_stop() {
        this.setContent("");
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
`
const Part = styled(motion.div)`
    text-align: center;
`