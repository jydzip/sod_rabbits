import { Vector3, Scene, Object3D } from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as dat from 'dat.gui';

import Loader from './engine/Loader';
import Renderer from './engine/Renderer';
import Camera from './engine/Camera';
import Interaction from './engine/Interaction';
import SeedScene from './SeedScene';

let lastTimestamp = 0;

class SceneManager {
    private static instance: SceneManager | null = null;
  
    public initialized: boolean = false;
    public started: boolean = false;
    
    public scene: Scene;
    private loader: Loader;
    private renderer: Renderer;
    private camera: Camera;
    private interaction: Interaction;
    public gui: dat.GUI;

    public seedScene: SeedScene;
    public DEBUG = true;
  
    private constructor() {
      this.gui = new dat.GUI();
      this.scene = new Scene();
      this.loader = new Loader(this);
      this.renderer = new Renderer(this);
      this.camera = new Camera(this);      
      this.interaction = new Interaction(this);
    }

    public add(object: Object3D): void {
      this.scene.add(object);
    }

    public async init(): Promise<void> {
      if (this.initialized) return;
      this.seedScene = new SeedScene();
      await this.seedScene.init()
      this.add(this.seedScene);

      this.camera.camera.position.set(5, 2.3, -7);
      // this.camera.camera.position.set(5, 3, -5);
      this.camera.camera.lookAt(new Vector3(2, 2, 0));


      if (this.DEBUG) {
        this.initGUI();
      }
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
  
      const animate = (timestamp: number) => {
        requestAnimationFrame(animate);

        this.update(timestamp);
      };
      animate(0);

      this.interaction.start();

      this.started = true;
    }

    private update(timestamp: number) {
      const dt = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      this.seedScene.update(dt);
      TWEEN.default.update();
      this.render()
    }

    private render() {
      this.getRenderer().renderer.render(this.scene, this.getCamera().camera);
    }

    private initGUI() {
      const gui = this.gui;
      const rabbitFolder = gui.addFolder('Camera');
      rabbitFolder.add(this.camera.camera.position, 'x');
      rabbitFolder.add(this.camera.camera.position, 'y');
      rabbitFolder.add(this.camera.camera.position, 'z');
      rabbitFolder.add(this.camera.camera.rotation, 'x');
      rabbitFolder.add(this.camera.camera.rotation, 'y');
      rabbitFolder.add(this.camera.camera.rotation, 'z');
    }
  
    public getLoader(): Loader {
      return this.loader;
    }
    public getRenderer(): Renderer {
      return this.renderer;
    }
    public getCamera(): Camera {
      return this.camera;
    }
    public getInteraction(): Interaction {
      return this.interaction;
    }
}
  
export default SceneManager;