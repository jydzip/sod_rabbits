import { Vector3, Scene, Object3D, Clock } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';

import Loader from './engine/Loader';
import Renderer from './engine/Renderer';
import CameraManager from './engine/CameraManager';
import Interaction from './engine/Interaction';
import UIManager from './engine/UIManager';
import SeedScene from './SeedScene';

let lastTimestamp = 0;

class SceneManager {
    private static instance: SceneManager | null = null;
  
    public initialized: boolean = false;
    public started: boolean = false;
    
    public scene: Scene;
    private loader: Loader;
    private renderer: Renderer;
    private cameraManager: CameraManager;
    private interaction: Interaction;
    public uiManager: UIManager;
    public gui: dat.GUI;
    private clock: Clock;

    public seedScene: SeedScene;
    public DEBUG = true;
  
    private constructor() {
      this.gui = new dat.GUI();
      this.uiManager = new UIManager();
      this.scene = new Scene();
      this.loader = new Loader(this);
      this.renderer = new Renderer(this);
      this.cameraManager = new CameraManager(this);      
      this.interaction = new Interaction(this);
    }

    public add(object: Object3D): void {
      this.scene.add(object);
    }
    public remove(object: Object3D): void {
      this.scene.remove(object);
    }

    public async init(): Promise<void> {
      if (this.initialized) return;
      this.seedScene = new SeedScene();
      await this.seedScene.init()
      this.add(this.seedScene);

      this.cameraManager.camera.position.set(5, 2.3, -7);
      this.cameraManager.camera.lookAt(new Vector3(2, 2, 0));

      this.initialized = true;
    }
  
    public static getInstance(): SceneManager {
      if (!SceneManager.instance) {
        SceneManager.instance = new SceneManager();
      }
      return SceneManager.instance;
    }

    public start() {
      if (!this.initialized || this.started) return;
  
      this.clock = new Clock();
      const animate = () => {
        requestAnimationFrame(animate);
        this.update();
      };

      this.interaction.start().then(() => {
        this.started = true;
        animate();
      });
    }

    private update() {
      const delta = this.clock.getDelta();
      this.seedScene.update(delta);
      TWEEN.default.update();

      const step = this.interaction.getCurrentStep();
      if (step) step.update(delta);
  
      this.render()
    }

    private render() {
      const cm = this.getCameraManager();
      const renderer = this.getRenderer().renderer;

      cm.camera.update();
      renderer.render(this.scene, cm.camera);
    }
  
    public getLoader(): Loader {
      return this.loader;
    }
    public getRenderer(): Renderer {
      return this.renderer;
    }
    public getCameraManager(): CameraManager {
      return this.cameraManager;
    }
    public getInteraction(): Interaction {
      return this.interaction;
    }
}
  
export default SceneManager;