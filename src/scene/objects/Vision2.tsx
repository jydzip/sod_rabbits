import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import ObjectGroup from '../engine/ObjectGroup';


export default class Vision2 extends ObjectGroup {
    private vision_2_1: THREE.Mesh;
    private vision_2_2: THREE.Mesh;
    private vision_text_1: THREE.Mesh;
    private vision_text_2: THREE.Mesh;

    constructor() {    
        super();
        this.name = 'vision2';
        console.log('[OBJECT] Vision2 loaded');

        const loader = this.smc.getLoader();
        const vision_2_1_texture = loader.loadTexture('./textures/vision_2_1.png');
        const vision_2_2_texture = loader.loadTexture('./textures/vision_2_2.png');

        const material_2_1 = new THREE.MeshBasicMaterial({ map: vision_2_1_texture });
        const material_2_2 = new THREE.MeshBasicMaterial({ map: vision_2_2_texture });
    
        const geometry_2_1 = new THREE.PlaneGeometry(1.2, 1);
        const geometry_2_2 = new THREE.PlaneGeometry(1.2, 1);
    
        const vision_2_1 = new THREE.Mesh(geometry_2_1, material_2_1);
        const vision_2_2 = new THREE.Mesh(geometry_2_2, material_2_2);
        vision_2_1.position.set(-1, 2.7, -2.3);
        vision_2_1.rotation.y = 0.2;
        vision_2_2.position.set(1, 2.7, -2.3);
        vision_2_2.rotation.y = -0.2;

        this.vision_2_1 = vision_2_1;
        this.vision_2_2 = vision_2_2;

        const vision_txt_1_texture = loader.loadTexture('./textures/vision_text_1.png');
        const vision_txt_2_texture = loader.loadTexture('./textures/vision_text_2.png');

        const material_text_1 = new THREE.MeshBasicMaterial({ map: vision_txt_1_texture });
        const material_text_2 = new THREE.MeshBasicMaterial({ map: vision_txt_2_texture });

        const geometry_text_1 = new THREE.PlaneGeometry(1, 0.2);
        const geometry_text_2 = new THREE.PlaneGeometry(1, 0.2);

        const vision_text_1 = new THREE.Mesh(geometry_text_1, material_text_1);
        const vision_text_2 = new THREE.Mesh(geometry_text_2, material_text_2);
        vision_text_1.position.set(-1, 3.35, -2.3);
        vision_text_1.rotation.y = 0.2;
        vision_text_2.position.set(1, 3.35, -2.3);
        vision_text_2.rotation.y = -0.2;

        this.vision_text_1 = vision_text_1;
        this.vision_text_2 = vision_text_2;
    }
    public _start() {
        this.add(this.vision_2_1);
        this.add(this.vision_2_2);
        this.add(this.vision_text_1);
        this.add(this.vision_text_2);
        this.position.x = 7;
        this.smc.add(this);
    
        const tween = new TWEEN.Tween(this.position).to(new THREE.Vector3(0, 0, 0), 1500);
        tween.start();
    }
    public _remove() {
        this.position.x = 0;
        const tween = new TWEEN.Tween(this.position).to(new THREE.Vector3(-7, 0, 0), 1500);
        tween.start();
        setTimeout(() => {
            this.smc.remove(this.vision_2_1);
            this.smc.remove(this.vision_2_2);
            this.smc.remove(this.vision_text_1);
            this.smc.remove(this.vision_text_2);
            this.smc.remove(this);
        }, 800)
    }
}