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
  RUN_BEGIN = 'run_begin',
  RUN_END = 'run_end',
  WALK = 'walk',
  SLEEP = 'sleep',
}

export default class Rabbit extends ObjectGroup {
  private mixer?: THREE.AnimationMixer;
  private model?: THREE.Group;

  animations: THREE.AnimationClip[] = [];
  selectedAnimation: string;
  nextAnimation: string;
  loopAnimation: boolean;
  
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
      this.loadAnimations();
      this.setAnimation(RabbitAnimation.IDLE01, true);
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
  private loadAnimations() {
    for (const animation of Object.values(RabbitAnimation)) {
      const clip = THREE.AnimationClip.findByName(this.animations, animation);
      const action = this.mixer.clipAction(clip);
      if (animation == RabbitAnimation.IDLE01) {
        action.play();
      }
    }
  }

  async setAnimation(animationName: string, loop = true, nextAnimationName?: string, force = false) {
    return new Promise(async (resolve) => {
      if (!force && animationName == this.selectedAnimation) {
        return;
      };
      console.log(`[RABBIT] Animation ${animationName}${nextAnimationName ? ` -> ${nextAnimationName}` : ''}`);
      if (this.mixer && this.model) {
        this.stopAnimation();
      
        const clip = THREE.AnimationClip.findByName(this.animations, animationName);
        const action = this.mixer.existingAction(clip);
        this.selectedAnimation = animationName;
        this.nextAnimation = nextAnimationName;

        if (nextAnimationName) {
          loop = false;
        }
        if (!loop) {
          action.setLoop(THREE.LoopOnce, 0);
        }
        action.clampWhenFinished = true;
        action.enabled = true;

        const onAnimationFinished = () => {
          this.mixer.removeEventListener('finished', onAnimationFinished);
          if (nextAnimationName) {
            action.stop();
            this.setAnimation(nextAnimationName, true).then(() => {
              resolve(true);
            });
          } else {
            resolve(true);
          }
        };
        this.mixer.addEventListener('finished', onAnimationFinished);
        action.play();
      }
    });
  }
  stopAnimation() {
    this.mixer.stopAllAction();
  }

  public setPosition(_position: THREE.Vector3) {
    if (!this.model) return;
    this.model.position.set(_position.x, _position.y, _position.z);
  }
  public setRotation(_rotation: THREE.Vector3) {
    if (!this.model) return;
    this.model.rotation.set(_rotation.x, _rotation.y, _rotation.z);
  }

  public async move(instructions: {
    position: THREE.Vector3,
    rotation?: THREE.Euler,
    speed_position?: number,
    speed_rotation?: number
  }[]) {
    return new Promise(async (resolve) => {
        if (!this.model) {
            resolve(true);
            return;
        }
        const model = this.model;
        let previousTween: TWEEN.Tween<any> | null = null;

        this.setAnimation(RabbitAnimation.RUN_BEGIN, true, RabbitAnimation.RUN, true);

        for (let index = 0; index < instructions.length; index++) {
            const instruction = instructions[index];
            const _speed_position = instruction.speed_position || 900;
            const _position = instruction.position.clone();
            const _rotation = instruction.rotation ? instruction.rotation.clone() : null;

            console.log(`[RABBIT] Move ${index + 1}. X:${_position.x}#Y:${_position.y}#Z:${_position.z}`);

            const positionTween = new TWEEN.Tween(model.position)
                .to(_position, _speed_position)
                .easing(TWEEN.Easing.Quadratic.Out);

                if (instruction.rotation) {
                  const _speed_rotation = instruction.speed_rotation || 700;
                  const _rotation = instruction.rotation;
                  console.log(`[RABBIT] Move ${index + 1}. Rotation X:${_rotation.x}#Y:${_rotation.y}#Z:${_rotation.z}`);
        
                  positionTween.onStart(() => {
                    new TWEEN.Tween(model.rotation).to({x: _rotation.x, y: _rotation.y, z: _rotation.z}, _speed_rotation).start();
                  });
                }

            positionTween.onComplete(async () => {
                console.log(`[RABBIT] Move ${index + 1}!`);
                if (index === instructions.length - 1) {
                    console.log(`[RABBIT] Move completed!`);
                    this.setAnimation(RabbitAnimation.RUN_END, true, RabbitAnimation.IDLE01, false);
                    resolve(true);
                }
            });

            if (previousTween) {
                previousTween.chain(positionTween);
            } else {
                positionTween.start();
            }

            previousTween = positionTween;
        }
    });
  }

  update(dt: number) {
    if (this.mixer) {
      this.mixer.update(dt);
    }
  }

  private initGUI() {
    const gui = this.scm.gui;
    const rabbitFolder = gui.addFolder('Rabbit');
    const animationController = rabbitFolder.add(this, 'selectedAnimation', RabbitAnimation).listen().name('Animation');
    animationController.onChange((value) => {
      this.setAnimation(value, true, undefined);
    });
    rabbitFolder.add(this.model.position, 'x').listen();
    rabbitFolder.add(this.model.position, 'y').listen();
    rabbitFolder.add(this.model.position, 'z').listen();
    rabbitFolder.add(this.model.rotation, 'x').step(0.1).listen().name('Rotation x');
    rabbitFolder.add(this.model.rotation, 'y').step(0.1).listen().name('Rotation y');
    rabbitFolder.add(this.model.rotation, 'z').step(0.1).listen().name('Rotation z');
  }
}