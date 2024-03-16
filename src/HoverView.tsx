import { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import SceneManager from "./scene";

const HoverView: React.FC = () => {
    const [open, setOpen] = useState<boolean>(true);

    const [title, setTitle] = useState<string>('???');
    const [content, setContent] = useState<JSX.Element>(<>???</>);
    const [footer, setFooter] = useState<JSX.Element>(<>???</>);

    useEffect(() => {
        const sceneManager = SceneManager.getInstance();

        sceneManager.uiManager.openHV = (() => {
            setOpen(true);
        })
        sceneManager.uiManager.closeHV = (() => {
            setOpen(false);
        })
        sceneManager.uiManager.setTitleHV = ((value) => {
            setTitle(value);
        })
        sceneManager.uiManager.setContentHV = ((element) => {
            setContent(element);
        })
        sceneManager.uiManager.setFooterHV = ((element) => {
            setFooter(element);
        })
    
        setDebugContent();
    }, [])

    function setDebugContent() {
        setContent(<>
        <ul>
            <li>A <span className="mark">Test</span></li>
            <li>B <span className="underline">Test</span></li>
            <li>C <span className="italic">Test</span></li>
        </ul>
        <img src="./picture.jpg" />
        <div className="sub">@picture</div>
        </>)
    }

    return (
        <GlobalUI>
            <UI>
                <Borders />
                <Blur />
            </UI>
            <AnimatePresence>
            {open && (
                <Global>
                    <GlobalContent
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.85 }}
                    >
                        {title && <Title>{title}</Title>}
                        {content && (
                            <Content>{content}</Content>
                        )}
                    </GlobalContent>
                    {footer && (
                        <GlobalFooter
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 0.85 }}
                        >
                            <Footer>
                                {footer}
                            </Footer>
                        </GlobalFooter>
                    )}
                </Global>
            )}
            </AnimatePresence>
        </GlobalUI>
    )
}
export default HoverView;

const GlobalUI = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
`
const UI = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
`
const Borders = styled.div`
    width: 98%;
    height: 98%;
    margin: 10px;
    box-sizing: border-box;
    border: 2px solid #ffffff80;
    border-radius: 40px 5px;
    position: absolute;
`
const Blur = styled.div`
    width: 100%;
    height: 100%;
    box-shadow: #ffffff40 5px -10px 70px inset;
    position: absolute;
`

const Global = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    color: #fff;
    text-shadow: 1.5px 1.5px 0 #6e6e6e, 1.5px -1.5px 0 #6e6e6e, -1.5px 1.5px 0 #6e6e6e, -1.5px -1.5px 0 #6e6e6e, 1.5px 0px 0 #6e6e6e, 0px 1.5px 0 #6e6e6e, -1.5px 0px 0 #6e6e6e, 0px -1.5px 0 #6e6e6e;
    font-size: 20px;
`
const GlobalContent = styled(motion.div)`
    position: absolute;
    left: 3%;
    top: 3%;
    background: #3939396b;
    background: linear-gradient(180deg, rgb(0 36 1 / 43%) 0%, rgb(57 121 9 / 45%) 35%, rgb(0 173 255 / 36%) 100%);
    min-height: 60vh;
    width: 40vw;
    text-align: center;
    padding: 10px;
    border: 2px solid #ffffff3b;
    border-radius: 34px 1px 12px 5px;
`
const Title = styled.div`
    font-size: 34px;
    margin-bottom: 10px;
`
const Content = styled.div`
    text-align: left;

    & ul {
        list-style-type: circle;
    }
    & img {
        width: 80%;
        margin-left: 10%;
        opacity: 0.85;
        border-radius: 5px;
    }
    & div.sub {
        font-size: 14px;
        text-shadow: none;
        color: #5d5c5c;
        text-align: center;
        margin-top: -3px;
        margin-left: -8px;
        margin-bottom: 8px;
        font-style: italic;
    }
    & span.mark {
        background: #575757;
        padding: 3px 7px;
        box-sizing: border-box;
        border-radius: 7px;
        font-size: 19px;
        margin: 0 5px;
    }
    & .underline {
        text-decoration: underline;
    }
    & .italic {
        font-style: italic;
    }
`
const Footer = styled.div`
    width: 100%;
    height: 100%;
    padding: 9px;
    border: 2px solid #ffffff3b;
    border-radius: 1px 12px 35px 10px;
    background: rgb(0 173 255 / 11%);
    box-sizing: border-box;
    position: relative;
`
const GlobalFooter = styled(motion.div)`
    position: absolute;
    bottom: 3%;
    width: 93.5%;
    height: 25vh;
    left: 3.5%;
`