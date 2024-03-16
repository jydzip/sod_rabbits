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


// Thanks: https://discourse.threejs.org/t/how-to-converting-world-coordinates-to-2d-mouse-coordinates-in-threejs/2251/3
export function toScreenPosition(renderer: THREE.WebGLRenderer, obj, camera: THREE.Camera)
{
  var vector = new THREE.Vector3();
  vector.x = ( vector.x + 1) * renderer.domElement.width / 2;
  vector.y = - ( vector.y - 1) * renderer.domElement.height / 2;
  vector.z = 0;
  return vector;
};