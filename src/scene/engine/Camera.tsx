import * as THREE from 'three';
import SceneManager from '..';

class Camera {
  private scm: SceneManager;
  public camera: THREE.PerspectiveCamera;

  constructor(scm: SceneManager) {
    console.log('[Initialization] Camera');
    this.scm = scm;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  }

  public setCameraPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z);
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}

export default Camera;