import * as THREE from 'three';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import RabbitSvg from '../../RabbitSvg';

export default class AStep extends Step {
    key = StepLabels[StepEnum.A];
    id = StepEnum.A;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Step A");

        this.setRabbitPositionDefault();
        this.setRabbitAnimationDefault();
        this.setContentHoverView(
            <></>
        )
        this.setFooterHoverView(<>
            <RabbitSvg />
        </>);
        this._();

        await this.circleMove();
    }

    async circleMove() {
        const rabbit = this.smc.seedScene.rabbit;
    
        const startPosition = new THREE.Vector3(0, 0, 0);
        const radius = 5;
        const numSegments = 15;

        const instructions: {
            position: THREE.Vector3;
            rotation?: THREE.Euler;
            speed_position?: number;
            speed_rotation?: number;
        }[] = [];

        for (let i = 0; i <= numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;
            const x = startPosition.x + Math.cos(angle) * radius;
            const z = startPosition.z + Math.sin(angle) * radius;
            const position = new THREE.Vector3(x, 0, z);
            const rotation = new THREE.Euler(0, -angle + Math.PI, 0);
            instructions.push({
                position,
                rotation,
                speed_position: i == 0 ? 1000 : 350,
                speed_rotation: i == 0 ? 100 : 200
            });
        }
        const startAngleSecondLoop = (numSegments / numSegments) * Math.PI * 2;

        for (let i = 1; i <= numSegments; i++) {
            const angle = startAngleSecondLoop + (i / numSegments) * Math.PI * 2;
            const x = startPosition.x + Math.cos(angle) * radius;
            const z = startPosition.z + Math.sin(angle) * radius;
            const position = new THREE.Vector3(x, 0, z);
            const rotation = new THREE.Euler(0, -angle + Math.PI, 0); 
            instructions.push({ position, rotation, speed_position: 350, speed_rotation: 200 });
        }

        instructions.push({ position: startPosition, rotation: new THREE.Euler(0, -13, 0), speed_position: 1000, speed_rotation: 800 });

        await rabbit.move(instructions);
        this._();
    }
}