import * as THREE from 'three';

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
    console.log(`[RABBIT] Animation ${animationName}${nextAnimationName ? ` -> ${nextAnimationName}` : ''}`)
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

  update(dt: number) {
    if (this.mixer) {
      this.mixer.update(dt * 0.001);
    }
  }

  private initGUI() {
    const gui = this.scm.gui;
    const rabbitFolder = gui.addFolder('Rabbit Animation');
    const animationController = rabbitFolder.add(this, 'selectedAnimation', RabbitAnimation);
    animationController.onChange((value) => {
      console.log(value)
      this.setAnimation(value, undefined, true);
    });
  }
}