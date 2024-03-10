import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import SceneManager from './scene';

TWEEN.default.update();


const AppScene: React.FC = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const sceneManager = SceneManager.getInstance();

    useEffect(() => {
        if (sceneRef.current) {
            const scene = sceneManager.scene;
            const camera = sceneManager.getCamera().camera;
            const renderer = sceneManager.getRenderer().renderer;
            const interaction = sceneManager.getInteraction();

            sceneRef.current.appendChild(renderer.domElement);

            sceneManager.init().then(() => {
                sceneManager.start();

                const handleResize = () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
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
        <>
            <div ref={sceneRef} />
        </>
    );
};

export default AppScene;