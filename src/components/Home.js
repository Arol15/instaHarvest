import { useRef, useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import ShareProducts from "./ShareProducts";
import SearchMain from "./product/SearchMain";

import { setHomePage } from "../store/currentPageSlice";
import { Canvas } from "@react-three/fiber";
import OrangeObj from "../assets/objects/OrangeObj";

import styled from "styled-components/macro";

const HomeStyled = styled.div`
  // flex: 1;
  padding-top: 100px;

  text-align: center;
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
        <h1>Welcome to instaHarvest</h1>
        <SearchMain />
        <ShareProducts />

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
