import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import SceneManager from "..";
import Step, { StepEnum, StepLabels } from "./Step";
import { RabbitAnimation } from '../objects/Rabbit';
import styled from 'styled-components';

export default class EndingStep extends Step {
    key = StepLabels[StepEnum.Ending];
    id = StepEnum.Ending;

    constructor(scm: SceneManager) {
        super(scm);
    }

    async play() {
        this.setPositionDefault();
        this.setRabbitPositionDefault();
        this.openHoverView();
        this.setTitleHoverView("Thank You");

        this.setRabbitAnimation({ name: RabbitAnimation.SLEEP, loop: true }, undefined, true);

        this.setContentHoverView(
            <></>
        );
        this.setScreenHoverView(undefined);
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
    border-top-color: #ffffff78;
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