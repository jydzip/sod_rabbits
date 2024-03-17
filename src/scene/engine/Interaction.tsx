import * as THREE from 'three';
import SceneManager from '..';
import Step, { StepEnum, StepLabels } from '../steps/Step';
import IntroStep from '../steps/IntroStep';
import EndingStep from '../steps/EndingStep';
import AStep from '../steps/AStep';
import BStep from '../steps/BStep';
import VisionStep from '../steps/VisionStep';

export const POSITION_STEP_DEFAULT = {
    x: 5,
    y: 2.3,
    z: -7
}
class Interaction {
    private scm: SceneManager;
    private camera: THREE.PerspectiveCamera;

    currentStep: number;
    currentLabel: string;
    steps: { [key: number]: Step };

    constructor(scm: SceneManager) {
        console.log('[Initialization] Interaction');
        this.scm = scm;
        this.camera = scm.getCamera().camera;

        this.currentStep = StepEnum.Intro;
        this.currentLabel = StepLabels[this.currentStep];
        this.steps = {};
        this.initSteps()

        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowRight':
                    this.playNextStep();
                    break;
                case 'ArrowLeft':
                    this.playPreviousStep();
                    break;
            }
        });

        if (this.scm.DEBUG) {
            this.initGUI();
        }
    }
    private initSteps() {
        this.steps[StepEnum.Intro] = new IntroStep(this.scm);
        this.steps[StepEnum.A] = new AStep(this.scm);
        this.steps[StepEnum.B] = new BStep(this.scm);
        this.steps[StepEnum.Vision] = new VisionStep(this.scm);
        this.steps[StepEnum.Ending] = new EndingStep(this.scm);
    }

    public start() {
        this.playNextStep()
    }

    public playNextStep() {
        if (this.currentStep < Object.keys(this.steps).length) {
            this.stopCurrentStep();
            this.currentStep++;
            this.steps[this.currentStep]._play();
            this.currentLabel = this.steps[this.currentStep].key;
        } else {
            console.log("No more step.");
        }
    }
    public playPreviousStep() {
        this.stopCurrentStep();
        this.currentStep--;
        if (this.currentStep < 1) {
            this.currentStep = 1;
        }
        this.steps[this.currentStep]._play();
        this.currentLabel = this.steps[this.currentStep].key;
    }
    public stopCurrentStep() {
        const currentStep = this.steps[this.currentStep];
        if (currentStep && currentStep.isPlaying) {
            currentStep.stop();
        }
    }

    private initGUI() {
        const gui = this.scm.gui;
        const stepFolder = gui.addFolder('Step');
        const stepController = stepFolder.add(this, 'currentLabel', Object.values(StepLabels)).listen();
        stepController.onChange((value) => {
            const selectedStep = Object.keys(StepLabels).find(key => StepLabels[key] === value);
            this.currentLabel = value;
            this.currentStep = parseInt(selectedStep);
            if (this.currentStep > 0) {
                this.steps[this.currentStep]._play();
            }
        });
    }
}

export default Interaction;

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 
  