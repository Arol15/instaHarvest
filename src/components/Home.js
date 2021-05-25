import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import SearchMain from "./product/SearchMain";
import ButtonWithIcon from "./UI/ButtonWithIcon";
import { RiHandCoinLine } from "react-icons/ri";
import UnderConstruction from "./UI/UnderConstruction";
import { Flex } from "../components/styled/styled";
import { setHomePage } from "../store/currentPageSlice";
import styled from "styled-components/macro";

const HomeStyled = styled(Flex)`
  position: relative;
  padding-top: 100px;
  left: 0;
  padding-left: 0;
  flex-direction: row;
  justify-content: center;
`;

const LeftColumn = styled.div`
  position: relative;
  // flex: 0.5;
  z-index: 2;
  // flex: 1;
  // padding-left: 40px;
  color: ${({ theme }) => theme.secondaryTextColor};
  text-align: center;
`;

const RightColumn = styled.div`
  // flex: 2;
  z-index: 1;
  position: relative;
  // width: 50%;
`;

const FrontImage = styled.img`
  position: relative;
  // z-index: 0;
  left: 0;
  top: 0;
  width: 100%;
  // height: 100%;
  height: 100%;
  max-width: 400px;
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
        <LeftColumn>
          <h1 id="w1">Find homegrown fruits and vegetables</h1>
          <UnderConstruction />
        </LeftColumn>
        <RightColumn>
          <FrontImage src="https://instaharvest.net/assets/images/front-img2.png" />
        </RightColumn>
      </HomeStyled>
      <SearchMain />
      <ButtonWithIcon
        addCss="margin-top: 20px;"
        onClick={() => history.push("/add-product")}
        icon={<RiHandCoinLine size="20px" />}
      >
        Share
      </ButtonWithIcon>
    </Background>
  );
};

export default Home;
