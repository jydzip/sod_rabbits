import * as THREE from 'three';

import ObjectGroup from './ObjectGroup';

export default class BasicLights extends ObjectGroup {
    constructor() {
        super();

        var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 300, 0);
        this.add( hemiLight );

        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(75, 300, -75);
        this.add(dirLight);
    }
}