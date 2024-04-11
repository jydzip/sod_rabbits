import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const MainScreen = () => {
  let th = 0;
  const [tht, setTht] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      let _th = th + 1;
      if (_th > 3) _th = 0
      th = _th;
      setTht(".".repeat(_th));
    }, 500);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <>
      <Background />
      <Shadow
        src="./rabbit_shadow.png"
        initial={{ rotate: 0, scaleY: 1 }}
        animate={{ rotate: [-5, 5], scaleY: [0.9, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      <Acc src="./acc.png" />
      <TouchEnter
        initial={{ scale: 1, x: "-50%", y: "-50%", color: '#ffffffbd' }}
        animate={{ scale: [1, 0.8, 1.1, 1], color: ['#ffffffbd',  '#c6ffb3'] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
      >
        Touch ENTER
      </TouchEnter>
      <OnGoing>
        Waiting<span>{tht}</span>
      </OnGoing>
      {/* <Infos>
        <Info>
          <img src="arrow_l.png" />
          <span>Step</span>
          <img src="arrow_r.png" />
        </Info>

        <Info2>
          <img src="arrow_u.png" />
          <span>Stade</span>
          <img src="arrow_d.png" />
        </Info2>
      </Infos> */}
    </>
  )
};
export default MainScreen;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("./bg_overlay.png");
  background-size: 500px;
  animation: backgroundScroll 80s linear infinite;
  @keyframes backgroundScroll {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -100% -100%;
    }
  }
`
const Infos = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  color: #e2e2e2;
  font-size: 32px;
  width: 100%;

  & img {
    width: 100px;
    margin: 22px;
  }
`
const Info = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin: 60px;
`
const Info2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 60px;
`

const TouchEnter = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 50%;
  font-size: 50px;
  text-shadow: none !important;
  color: #ffffffbd;
`
const Acc = styled.img`
  position: fixed;
  bottom: 0;
  width: 100%;
`
const Shadow = styled(motion.img)`
  position: fixed;
  bottom: 0;
  width: 20%;
  right: 20%;
  opacity: 0.4;
`
const OnGoing = styled.div`
  position: fixed;
  top: 40%;
  transform: translateY(-50%);
  font-size: 90px;
  color: #b3b3b3;
  width: 100%;
  text-align: center;
  background: #00000030;

  & span {
    position: absolute;
  }
`