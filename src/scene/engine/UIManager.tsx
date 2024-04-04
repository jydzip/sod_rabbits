class UIManager {
    openHV: () => void;
    closeHV: () => void;
    setTitleHV: (value: string) => void;
    setContentHV: (element: JSX.Element) => void;
    setFooterHV: (element: JSX.Element | null) => void;
    setScreenHV: (element: JSX.Element | null) => void;
    setStep: (step: number) => void;
    setStepMax: (stepMax: number) => void;
    setStade: (stade: number) => void;
    setStadeMax: (stadeMax: number) => void;

    constructor() {
        this.openHV = () => { };
        this.closeHV = () => { };
        this.setTitleHV = (value: string) => { };
        this.setContentHV = (element: JSX.Element) => { };
        this.setFooterHV = (element: JSX.Element | null) => { };
        this.setScreenHV = (screen: JSX.Element | null) => { };
        this.setStep = (step: number) => { };
        this.setStepMax = (stepMax: number) => { };
        this.setStade = (stade: number) => { };
        this.setStadeMax = (stadeMax: number) => { };
    }
}
export default UIManager;