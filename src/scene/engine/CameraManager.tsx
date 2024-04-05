import * as THREE from 'three';
import SceneManager from '..';
import { degToRad } from 'three/src/math/MathUtils';


class CameraManager {
  private scm: SceneManager;
  public camera: RabbitCamera;

  constructor(scm: SceneManager) {
    console.log('[Initialization] Camera');
    this.scm = scm;
    const horizontalFov = degToRad(210);
    const near = 0.1;
    const aspect = window.innerWidth / window.innerHeight;
    const far = 10000;
    this.camera = new RabbitCamera(
      scm,
      {
        fov: 75,
        aspect,
        near,
        far
      },
      {
        fov: horizontalFov,
        aspect,
        near,
        far
      }
    );
  }

  public setCameraPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z);
  }
  public setCameraRotation(x: number, y: number, z: number) {
    this.camera.rotation.x = x;
    this.camera.rotation.y = y;
    this.camera.rotation.z = z;
  }

  public setIsCameraRabbit(status: boolean) {
    this.camera.isRabbitVision = status;
  }
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
export default CameraManager;


interface CameraParams {
  fov: number,
  aspect: number,
  near: number,
  far: number
}
class RabbitCamera extends THREE.PerspectiveCamera {
  private scm: SceneManager;

  private panoramaParams: CameraParams;
  public isRabbitVision: boolean;
  private transitionDuration: number;
  private transitionStartTime: number;

  private headMovementSpeed = 2.1;
  private headMovementAmplitude = 0.1;

  constructor(scm: SceneManager, perspectiveParams: CameraParams, panoramaParams: CameraParams) {
    super(perspectiveParams.fov, perspectiveParams.aspect, perspectiveParams.near, perspectiveParams.far);
  
    this.scm = scm;
    this.panoramaParams = panoramaParams;
    this.isRabbitVision = false;
    this.transitionDuration = 500;
    this.transitionStartTime = 0;

    if (this.scm.DEBUG) {
      this.initGUI();
    }
  }

  public update() {
    if (this.isRabbitVision) {
      this.simulateCameraTracking()

      const t = Math.min((performance.now() - this.transitionStartTime) / this.transitionDuration, 1);
      const vFOV = this.panoramaParams.fov * 0.15;
      const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * this.panoramaParams.aspect);
      this.projectionMatrix.makePerspective(
        -hFOV / 3, hFOV / 3, vFOV / 5, -vFOV / 2, this.panoramaParams.near, this.panoramaParams.far
      );
    } else {
      super.updateProjectionMatrix();
    }
  }

  private simulateCameraTracking() {
    if (!this.scm.seedScene?.rabbit.headTrack) return;
    const headMovement = (Math.sin(performance.now() * (this.headMovementSpeed / 1000)) * this.headMovementAmplitude) * -1;

    const track = this.scm.seedScene.rabbit.headTrack;
    this.position.copy(track.position);
    this.position.y += headMovement;
    this.position.z += 3;
    this.position.x += 2.24;
  }

  private initGUI() {
    const gui = this.scm.gui;
    const camera = this;
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'x').listen();
    cameraFolder.add(camera.position, 'y').listen();
    cameraFolder.add(camera.position, 'z').listen();
    cameraFolder.add(camera.rotation, 'x').step(0.1).listen().name('Rotation x');
    cameraFolder.add(camera.rotation, 'y').step(0.1).listen().name('Rotation y');
    cameraFolder.add(camera.rotation, 'z').step(0.1).listen().name('Rotation z');
  }
}