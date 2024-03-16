import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import ObjectGroup from '../engine/ObjectGroup';

const SCALE_RABBIT = 7;
export enum RabbitAnimation {
  NULL = 'pose',
  IDLE01 = 'idle01',
  IDLE02 = 'idle02',
  IDLE03 = 'idle03',
  IDLE04 = 'idle04',
  RUN = 'run',
  WALK = 'walk',
  SLEEP = 'sleep',
}

export default class Rabbit extends ObjectGroup {
  private mixer?: THREE.AnimationMixer;
  private model?: THREE.Group;

  animations: THREE.AnimationClip[] = [];
  selectedAnimation: string;
  
  constructor() {    
    super();

    this.name = 'rabbit';
    console.log('[OBJECT] Rabbit loaded')
  
    this.selectedAnimation = RabbitAnimation.NULL;
  }
  async init() {
    await this.loadModel();
    if (this.scm.DEBUG) {
      this.initGUI();
    }
  }

  async loadModel() {
    const loader = this.scm.getLoader();
    try {
      const [model, animations] = await loader.loadModelAsync(`./models/rabbit.glb`);
      this.animations = animations;
      if (this.model) {
        this.remove(this.model);
      }
      model.scale.set(SCALE_RABBIT, SCALE_RABBIT, SCALE_RABBIT);
      this.mixer = new THREE.AnimationMixer(model);
      this.model = model;
      this.setAnimation(this.selectedAnimation);
      this.add(this.model);
    } catch (error) {
      console.error('[ERROR] Loader model', error);
    }

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
    hemiLight.position.set( 0, 300, 0 );
    this.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set( 75, 300, -75 );
    this.add(dirLight);
  }

  setAnimation(animationName: string, nextAnimationName?: string, force = false) {
    console.log(`[RABBIT] Animation ${animationName}${nextAnimationName ? ` -> ${nextAnimationName}` : ''}`);
    if (!force && animationName == this.selectedAnimation) {
      return;
    };
    if (this.mixer && this.model) {
      this.mixer.stopAllAction();
    
      const clip = this.animations.find(anim => anim.name == animationName);
      let nextClip = null as THREE.AnimationClip;
      if (nextAnimationName) {
        nextClip = this.animations.find(anim => anim.name == nextAnimationName);
      }
    
      const action = this.mixer.clipAction(clip);
      action.play();

      const onAnimationFinished = () => {
        if (nextClip) {
          const nextAction = this.mixer.clipAction(nextClip);
          nextAction.reset();
          nextAction.play();
          this.selectedAnimation = nextAnimationName;
        } else {
          action.loop = THREE.LoopRepeat;
          action.reset();
          action.play();
        }
      };

      if (nextClip) {
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopOnce, 0);
        this.mixer.addEventListener('finished', onAnimationFinished);
      }
    
      this.selectedAnimation = animationName;
    }
  }

  public setPosition(_position: THREE.Vector3) {
    if (!this.model) return;
    this.model.position.set(_position.x, _position.y, _position.z);
  }
  public setRotation(_rotation: THREE.Vector3) {
    if (!this.model) return;
    this.model.rotation.set(_rotation.x, _rotation.y, _rotation.z);
  }

  public async move(_position: THREE.Vector3, _rotation?: THREE.Vector3) {
    return new Promise((resolve) => {
      if (!this.model) {
        resolve(true);
        return;
      }
      const position = this.model.position;
      console.log(`[RABBIT] Move X:${_position.x}#Y:${_position.y}#Z:${_position.z} -> X:${position.x + _position.x}#Y:${position.y + _position.y}#Z:${position.z + _position.z}`);
      const tween = new TWEEN.Tween(this.model.position)
        .to(new THREE.Vector3(
          position.x + _position.x, position.y + _position.y, position.z + _position.z
        ), 800)
        .onComplete(() => {
          console.log(`[RABBIT] Move completed!`);
          resolve(true);
        });
      tween.start();

      if (_rotation) {
        const rotation = this.model.rotation;
        console.log(`[RABBIT] Move Rotation X:${_rotation.x}#Y:${_rotation.y}#Z:${_rotation.z} -> X:${rotation.x + _rotation.x}#Y:${rotation.y + _rotation.y}#Z:${rotation.z + _rotation.z}`);
        const tween_rotation = new TWEEN.Tween(this.model.rotation)
          .to(new THREE.Vector3(
            rotation.x + _rotation.x, rotation.y + _rotation.y, rotation.z + _rotation.z
          ), 650)
          .onComplete(() => {
            console.log(`[RABBIT] Move rotation completed!`);
          });
          tween_rotation.start();
      }
    });
  }

  update(dt: number) {
    if (this.mixer) {
      this.mixer.update(dt * 0.001);
    }
  }

  private initGUI() {
    const gui = this.scm.gui;
    const rabbitFolder = gui.addFolder('Rabbit');
    const animationController = rabbitFolder.add(this, 'selectedAnimation', RabbitAnimation).listen().name('Animation');
    animationController.onChange((value) => {
      this.setAnimation(value, undefined, true);
    });
    rabbitFolder.add(this.model.position, 'x').listen();
    rabbitFolder.add(this.model.position, 'y').listen();
    rabbitFolder.add(this.model.position, 'z').listen();
    rabbitFolder.add(this.model.rotation, 'x').step(0.1).listen().name('Rotation x');
    rabbitFolder.add(this.model.rotation, 'y').step(0.1).listen().name('Rotation y');
    rabbitFolder.add(this.model.rotation, 'z').step(0.1).listen().name('Rotation z');
  }
}