import { useRef, useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import SearchMain from "./product/SearchMain";
import ButtonWithIcon from "./UI/ButtonWithIcon";
import { RiHandCoinLine } from "react-icons/ri";
import UnderConstruction from "./UI/UnderConstruction";

import { setHomePage } from "../store/currentPageSlice";
import { Canvas } from "@react-three/fiber";
import OrangeObj from "../assets/objects/OrangeObj";

import styled from "styled-components/macro";

const HomeStyled = styled.div`
  // flex: 1;
  padding-top: 100px;
  color: ${({ theme }) => theme.secondaryTextColor};
  text-align: center;

  // @keyframes slideInFromLeft {
  //   0% {
  //     transform: translateX(20%);
  //   }
  //   100% {
  //     transform: translateX(0);
  //   }
  // }

  // #w1 {
  //   animation: 1s cubic-bezier(0.1, 0.1, 0.25, 1) 0s 1 slideInFromLeft;
  // }

  // #w2 {
  //   animation: 1s cubic-bezier(0.1, 0.1, 0.25, 1) 0.25s 1 slideInFromLeft;
  // }

  // #w3 {
  //   animation: 1s cubic-bezier(0.1, 0.1, 0.25, 1) 0.5s 1 slideInFromLeft;
  // }
`;

const Background = styled.div`
  background: ${({ theme }) => theme.mainColor};
  background-image: ${({ theme }) => `linear-gradient(
    135deg,
    ${theme.mainColor2} 0%,
    ${theme.mainColor} 54%,
    ${theme.mainColor2} 98%`} 
  );
  min-height: 100vh;
  width: 100%;
  top: 0;
  position: absolute;
`;

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHomePage(true));

    return () => {
      dispatch(setHomePage(false));
    };
  }, []);

  return (
    <Background>
      <HomeStyled>
        <h1 id="w1">Find homegrown fruits and vegetables</h1>
        <UnderConstruction />
        <SearchMain />
        <ButtonWithIcon
          addCss="margin-top: 20px;"
          onClick={() => history.push("/add-product")}
          icon={<RiHandCoinLine size="20px" />}
        >
          Share
        </ButtonWithIcon>

        {/* <Canvas concurent>
        <ambientLight intensity={0.5} />
        <pointLight intensity={0.3} position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <OrangeObj position={[0, 0, 0]} />
        </Suspense>
      </Canvas> */}
      </HomeStyled>
    </Background>
  );
};

export default Home;
