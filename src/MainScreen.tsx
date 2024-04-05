import { motion } from "framer-motion";
import styled from "styled-components";

const MainScreen = () => {
  return (
    <>
      <Background />
      <Shadow src="./rabbit_shadow.png" />
      <Acc src="./acc.png" />
      <TouchEnter
        initial={{ scale: 1, x: "-50%", y: "-50%" }}
        animate={{ scale: [1, 0.8, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Touch ENTER
      </TouchEnter>
      <Infos>
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
      </Infos>
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
  font-size: 22px;
  width: 100%;

  & img {
    width: 100px;
    margin: 10px;
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
  top: 50%;
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
const Shadow = styled.img`
  position: fixed;
  bottom: 0;
  width: 20%;
  right: 20%;
  opacity: 0.4;
`