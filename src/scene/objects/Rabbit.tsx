import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import ObjectGroup from '../engine/ObjectGroup';

const NAME_PARSLEY_ARMATURE = "ParsleyAmature";
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
  EAT = 'eat',
  EAT_PARSLEY = 'eat_parsley'
}

export interface InstructionMove {
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  speed_position?: number;
  speed_rotation?: number;
  delay?: number;
}
export interface InstructionAnimation {
  name: RabbitAnimation,
  loop: boolean,
  hideAfter?: THREE.Object3D
}

export default class Rabbit extends ObjectGroup {
  public main: boolean;
  private mixer?: THREE.AnimationMixer;
  private model?: THREE.Group;
  public parsley?: THREE.Object3D;
  headTrack?: THREE.Object3D;

  animations: THREE.AnimationClip[] = [];
  currentAction: THREE.AnimationAction;
  selectedAnimation: InstructionAnimation;
  selectedAnimationName: string;
  nextAnimation?: InstructionAnimation;
  loopAnimation: boolean;
  
  constructor(main = true) {    
    super();

    this.name = 'rabbit';
    console.log('[OBJECT] Rabbit loaded');
    this.main = main;
  
    this.selectedAnimation = {
      name: RabbitAnimation.NULL,
      loop: true
    };
    this.selectedAnimationName = RabbitAnimation.NULL;
  }
  async init() {
    await this.loadModel();
    if (this.smc.DEBUG && this.main) {
      this.initGUI();
    }
  }

  async loadModel() {
    const loader = this.smc.getLoader();
    try {
      const [model, animations] = await loader.loadModelAsync(`./models/rabbit.glb`);
      this.animations = animations;
      if (this.model) {
        this.remove(this.model);
      }
      model.children.map((child) => {
        if (child.name == NAME_PARSLEY_ARMATURE) {
          child.visible = false;
          this.parsley = child;
        }
      });

      // model.traverse((object) => {
      //   if (object.name) {
      //       console.log(object.name);
      //   }
      // });
      // B_Nose_00
      // Bip01_Head
      const track = model.getObjectByName('Bip01_Head');
      this.headTrack = track;

      model.scale.set(SCALE_RABBIT, SCALE_RABBIT, SCALE_RABBIT);
      this.mixer = new THREE.AnimationMixer(model);
      this.model = model;
      this.loadAnimations();
      this.setAnimation({
        name: RabbitAnimation.IDLE01,
        loop: true
      }, undefined, true);
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
      if (clip) {
        console.log(`[ANIMATION] Loaded ${animation}`)
      }
      const action = this.mixer.clipAction(clip);
      if (animation == RabbitAnimation.IDLE01) {
        action.play();
      }
    }
  }
  async setAnimation(animation: InstructionAnimation, nextAnimation?: InstructionAnimation, force = false, dualAnimation?: InstructionAnimation) {
    let loop = animation.loop;
    return new Promise(async (resolve) => {
      if (!force && animation.name == this.selectedAnimation.name) {
        return;
      };
      console.log(`[RABBIT] Animation ${animation.name}${nextAnimation ? ` -> ${nextAnimation.name}` : ''}`);
      if (this.mixer && this.model) {    
        const clip = THREE.AnimationClip.findByName(this.animations, animation.name);
        const action = this.mixer.existingAction(clip);
        let clipDual: THREE.AnimationClip;
        let actionDual: THREE.AnimationAction;
        if (dualAnimation) {
          clipDual = THREE.AnimationClip.findByName(this.animations, dualAnimation.name);
          actionDual = this.mixer.existingAction(clipDual);
          actionDual.reset();
          actionDual.setLoop(THREE.LoopOnce, 0);
        }

        this.selectedAnimation = animation;
        this.selectedAnimationName = animation.name;
        this.nextAnimation = nextAnimation;

        if (this.currentAction) {
          this.currentAction.fadeOut(0.2);
        }
        action.reset();
        action.fadeIn(0.2);

        if (nextAnimation) {
          loop = false;
        }
        if (!loop) {
          action.setLoop(THREE.LoopOnce, 0);
        }
        action.clampWhenFinished = true;
        action.enabled = true;
        this.currentAction = action;

        const onAnimationFinished = () => {
          this.mixer.removeEventListener('finished', onAnimationFinished);

          if (dualAnimation && dualAnimation.hideAfter) {
            dualAnimation.hideAfter.visible = false;
          }

          if (nextAnimation) {
            this.setAnimation(nextAnimation);
            resolve(true);
          } else {
            resolve(true);
          }
        };
        this.mixer.addEventListener('finished', onAnimationFinished);
        action.play();
      
        if (actionDual) {
          actionDual.play();
        };
      } else {
        console.log('[RABBIT] Animation MISSING mixer or model!')
      }
    });
  }
  // async setAnimation(animationName: string, loop = true, nextAnimationName?: string, force = false) {
  //   return new Promise(async (resolve) => {
  //     if (!force && animationName == this.selectedAnimation) {
  //       return;
  //     };
  //     console.log(`[RABBIT] Animation ${animationName}${nextAnimationName ? ` -> ${nextAnimationName}` : ''}`);
  //     if (this.mixer && this.model) {
  //       this.stopAnimation();
      
  //       const clip = THREE.AnimationClip.findByName(this.animations, animationName);
  //       const action = this.mixer.existingAction(clip);
  //       this.selectedAnimation = animationName;
  //       this.nextAnimation = nextAnimationName;

  //       if (nextAnimationName) {
  //         loop = false;
  //       }
  //       if (!loop) {
  //         action.setLoop(THREE.LoopOnce, 0);
  //       }
  //       action.clampWhenFinished = true;
  //       action.enabled = true;

  //       const onAnimationFinished = () => {
  //         this.mixer.removeEventListener('finished', onAnimationFinished);
  //         if (nextAnimationName) {
  //           action.stop();
  //           this.setAnimation(nextAnimationName, true).then(() => {
  //             resolve(true);
  //           });
  //         } else {
  //           resolve(true);
  //         }
  //       };
  //       this.mixer.addEventListener('finished', onAnimationFinished);
  //       action.play();
  //     }
  //   });
  // }
  stopAnimation() {
    this.mixer.stopAllAction();
  }

  public setPosition(_position: THREE.Vector3) {
    if (!this.model) return;
    this.model.position.set(_position.x, _position.y, _position.z);
  }
  public setRotation(_rotation: THREE.Euler) {
    if (!this.model) return;
    this.model.rotation.set(_rotation.x, _rotation.y, _rotation.z);
  }

  public async move(
    instructions: InstructionMove[],
    idleAnimation = RabbitAnimation.IDLE01,
    idleAnimationWait = false,
    walk = false
  ) {
    return new Promise(async (resolve) => {
        if (!this.model) {
          resolve(true);
          return;
        }
        const model = this.model;
        let previousTween: TWEEN.Tween<any> | null = null;

        this.setAnimation(
          {
            name: RabbitAnimation.RUN_BEGIN,
            loop: false
          },
          {
            name: walk ? RabbitAnimation.WALK : RabbitAnimation.RUN,
            loop: true
          }
        );

        for (let index = 0; index < instructions.length; index++) {
            const instruction = instructions[index];
            const _speed_position = instruction.speed_position || 900;
            const _position = instruction.position.clone();

            console.log(`[RABBIT] Move ${index + 1}. X:${_position.x}#Y:${_position.y}#Z:${_position.z}`);

            const positionTween = new TWEEN.Tween(model.position)
                .to(_position, _speed_position)
                .easing(TWEEN.Easing.Quadratic.Out);
            if (instruction.delay) {
              positionTween.delay(instruction.delay);
            }

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
                    if (idleAnimationWait) {
                      this.setAnimation(
                        {
                          name: RabbitAnimation.RUN_END,
                          loop: false
                        },
                        {
                          name: idleAnimation,
                          loop: false
                        }
                      ).then(() => {
                        resolve(true)
                      });
                    }
                    else {
                      this.setAnimation(
                        {
                          name: RabbitAnimation.RUN_END,
                          loop: false
                        },
                        {
                          name: idleAnimation,
                          loop: true
                        }
                      )
                      resolve(true);
                    }
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

  public setParsleyVisible(visible = true) {
    if (this.parsley) this.parsley.visible = visible;
  }

  public initGUI() {
    const gui = this.smc.gui;
    const rabbitFolder = gui.addFolder(`Rabbit ${!this.main ? ' B' : ''}`);
    const animationController = rabbitFolder.add(this, 'selectedAnimationName', RabbitAnimation).listen().name('Animation');
    animationController.onChange((value) => {
      this.setAnimation({
        name: value,
        loop: true,
      }, undefined, true);
    });
    rabbitFolder.add(this.model.position, 'x').listen();
    rabbitFolder.add(this.model.position, 'y').listen();
    rabbitFolder.add(this.model.position, 'z').listen();
    rabbitFolder.add(this.model.rotation, 'x').step(0.1).listen().name('Rotation x');
    rabbitFolder.add(this.model.rotation, 'y').step(0.1).listen().name('Rotation y');
    rabbitFolder.add(this.model.rotation, 'z').step(0.1).listen().name('Rotation z');
  }
}