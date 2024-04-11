import SceneManager from '..';
import Step, { StepEnum, StepLabels } from '../steps/Step';
import IntroStep from '../steps/IntroStep';
import EndingStep from '../steps/EndingStep';
import AStep from '../steps/AStep';
import BStep from '../steps/BStep';
import CStep from '../steps/CStep';
import DStep from '../steps/DStep';
import MainScreen from '../../MainScreen';

export const POSITION_STEP_DEFAULT = {
    x: 5,
    y: 2.3,
    z: -7
}
class Interaction {
    private scm: SceneManager;

    currentStep: number;
    currentLabel: string;
    steps: { [key: number]: Step };

    constructor(scm: SceneManager) {
        console.log('[Initialization] Interaction');
        this.scm = scm;

        this.currentStep = StepEnum.Null;
        this.currentLabel = StepLabels[this.currentStep];
        this.steps = {};
        this.initSteps();
        this.setStepStatus();

        document.addEventListener('keydown', (event) => {
            if (!this.scm.started) return;
            switch(event.key) {
                case 'ArrowRight':
                    this.playNextStep();
                    break;
                case 'ArrowLeft':
                    this.playPreviousStep();
                    break;
                case 'ArrowDown':
                    this.playNextStade();
                    break;
                case 'ArrowUp':
                    this.playPreviousStade();
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
        this.steps[StepEnum.C] = new CStep(this.scm);
        this.steps[StepEnum.D] = new DStep(this.scm);
        this.steps[StepEnum.Ending] = new EndingStep(this.scm);
    }

    public async start() {
        if (this.currentStep == 0) {
            await this.start_main_screen();
        }
        this.playNextStep();
    }
    private async start_main_screen() {
        this.scm.uiManager.setScreenHV(<MainScreen />)
        await waitForEnterKeyPress();
    }

    public getCurrentStep() {
        return this.steps[this.currentStep];
    }
    public playNextStep() {
        if (this.currentStep < Object.keys(this.steps).length) {
            this.stopCurrentStep();
            this.currentStep++;
            const step = this.getCurrentStep();
            step._play();
            this.currentLabel = step.key;
            this.setStepStatus();
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
        const step = this.getCurrentStep();
        step._play();
        this.currentLabel = step.key;
        this.setStepStatus();
    }
    public stopCurrentStep() {
        const step = this.getCurrentStep();
        if (step && step.isPlaying) {
            step._stop();
        }
    }

    public playNextStade() {
        const step = this.getCurrentStep();
        if (step) step.playNextStade();
    }
    public playPreviousStade() {
        const step = this.getCurrentStep();
        if (step) step.playPreviousStade();
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
                this.getCurrentStep()._play();
                this.setStepStatus();
            }
        });
    }

    private setStepStatus() {
        this.scm.uiManager.setStepMax(Object.keys(this.steps).length);
        this.scm.uiManager.setStep(this.currentStep);
    }
}

export default Interaction;

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 
function waitForEnterKeyPress(): Promise<void> {
    return new Promise<void>((resolve) => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                document.removeEventListener('keydown', handleKeyDown);
                resolve();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    });
}