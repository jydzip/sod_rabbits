import * as THREE from 'three';
import SceneManager from '..';
import Step, { StepEnum, StepLabels } from '../steps/Step';
import IntroStep from '../steps/IntroStep';
import EndingStep from '../steps/EndingStep';

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

        this.currentStep = StepEnum.Null;
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
        this.steps[StepEnum.Ending] = new EndingStep(this.scm);
    }

    public start() {
        this.playNextStep()
    }

    public playNextStep() {
        if (this.currentStep < Object.keys(this.steps).length) {
            this.currentStep++;
            this.steps[this.currentStep]._play();
            this.currentLabel = this.steps[this.currentStep].key;
        } else {
            console.log("No more step.");
        }
    }
    public playPreviousStep() {
        this.currentStep--;
        if (this.currentStep < 1) {
            this.currentStep = 1;
        }
        this.steps[this.currentStep]._play();
        this.currentLabel = this.steps[this.currentStep].key;
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