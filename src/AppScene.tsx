import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import SceneManager from './scene';
import HoverView from './HoverView';
import styled from 'styled-components';

TWEEN.default.update();


const AppScene: React.FC = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const sceneManager = SceneManager.getInstance();

    useEffect(() => {
        if (sceneRef.current) {
            sceneManager

            const scene = sceneManager.scene;
            const cameraManager = sceneManager.getCameraManager().camera;
            const renderer = sceneManager.getRenderer().renderer;
            const interaction = sceneManager.getInteraction();

            sceneRef.current.appendChild(renderer.domElement);

            sceneManager.init().then(() => {
                sceneManager.start();

                const handleResize = () => {
                    cameraManager.aspect = window.innerWidth / window.innerHeight;
                    cameraManager.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                };
                window.addEventListener('resize', handleResize);
    
                return () => {
                    window.removeEventListener('resize', handleResize);
                    sceneRef.current?.removeChild(renderer.domElement);
                    renderer.dispose();
                };
            });
        }
    }, [sceneManager]);

    return (
        <Global>
            <HoverView />
            {/* <RabbitSvg /> */}
            <div ref={sceneRef} />
        </Global>
    );
};

export default AppScene;

const Global = styled.div`
    position: relative;
`