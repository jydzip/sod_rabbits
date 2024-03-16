import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import styled from 'styled-components';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';
import { delay } from '../engine/Interaction';
import { toScreenPosition } from '../engine/Camera';

const DEBUG_PERSIL = true;

export default class BStep extends Step {
    key = StepLabels[StepEnum.A];
    id = StepEnum.A;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Step B");
        this.resetPersil();

        const rabbit = this.smc.seedScene.rabbit;
        this.setRabbitPositionDefault();
        rabbit.setAnimation(RabbitAnimation.IDLE02);
        this.setContentHoverView(
            <>
                <PersilImg src='./persil.png' id='persil' />
            </>
        )
        await delay(1000);
        await this.animationPersil();
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

        const { x, y, width, height } = persil.getBoundingClientRect();
        const _x = x + width;
        const _y = y + (height / 2);

        if (DEBUG_PERSIL) {
            const divDebug = document.createElement("div");
            divDebug.style.backgroundColor = 'red';
            divDebug.style.width = "10px";
            divDebug.style.height = "10px";
            divDebug.style.position = "absolute";
            divDebug.style.left = `${_x}px`;
            divDebug.style.top = `${_y}px`;
            document.body.appendChild(divDebug);
        }
    
        console.log("toScreenPosition()", toScreenPosition(this.smc.getRenderer().renderer, rabbit, this.smc.getCamera().camera));
        const _screen = toScreenPosition(this.smc.getRenderer().renderer, rabbit, this.smc.getCamera().camera);
        const _x_rabbit = _screen.x + 150;
        const _y_rabbit = _screen.y;

        if (DEBUG_PERSIL) {
            const divDebug1 = document.createElement("div");
            divDebug1.style.backgroundColor = 'yellow';
            divDebug1.style.width = "10px";
            divDebug1.style.height = "10px";
            divDebug1.style.position = "absolute";
            divDebug1.style.left = `${_x_rabbit}px`;
            divDebug1.style.top = `${_y_rabbit}px`;
            document.body.appendChild(divDebug1);
        }

        const to_x = (_x - _x_rabbit) / 100;
        const to_y = (_y - _y_rabbit) / 100;
        rabbit.setAnimation(RabbitAnimation.RUN);
        await rabbit.move(
            new THREE.Vector3(Math.abs(to_x), Math.abs(to_y), 0),
            new THREE.Vector3(0, -0.7, 0.2)
        );
        rabbit.setAnimation(RabbitAnimation.IDLE02);
        // @ts-ignore; Exist
        persil.src = './persil_holder.png';
        await delay(500);
        rabbit.setAnimation(RabbitAnimation.RUN);
        await rabbit.move(
            new THREE.Vector3(-Math.abs(to_x), -Math.abs(to_y), 0),
            new THREE.Vector3(0, 0.7, -0.2)
        );
        rabbit.setAnimation(RabbitAnimation.IDLE02);
    }

    
}

const PersilImg = styled.img`
    max-width: 200px;
    float: right;
`