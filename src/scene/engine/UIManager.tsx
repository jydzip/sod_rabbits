class UIManager {
    openHV: () => void;
    closeHV: () => void;
    setTitleHV: (value: string) => void;
    setContentHV: (element: JSX.Element) => void;
    setFooterHV: (element: JSX.Element | null) => void;

    constructor() {
        this.openHV = () => { };
        this.closeHV = () => { };
        this.setTitleHV = (value: string) => { };
        this.setContentHV = (element: JSX.Element) => { };
        this.setFooterHV = (element: JSX.Element | null) => { };
    }
}
export default UIManager;