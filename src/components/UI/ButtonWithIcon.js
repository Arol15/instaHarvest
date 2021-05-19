import { Flex, FlexRow } from "../styled/styled";

import styled from "styled-components/macro";

const ButtonContainer = styled(Flex)`
  position: relative;
  width: ${({ width }) => (width ? width : "100")}px;
  height: ${({ height }) => (height ? height : "40")}px;
  margin: 0 auto;
  color: ${({ theme }) => theme.buttonTextColor};
`;

const Shape = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ width }) => (width ? width : "100")}px;
  height: ${({ height }) => (height ? height : "40")}px;
  background: ${({ theme }) => theme.buttonDisabledColor};
  outline: none;
  border: 0;
  border-radius: 30px;
  cursor: pointer;
`;
const ButtonFront = styled(Shape)`
  transition: 0.5s cubic-bezier(0.99, 0.01, 0.1, 0.9);
  background: ${({ theme }) => theme.buttonColor};
`;

const ButtonBack = styled(Shape)`
  &:hover ${ButtonFront} {
    width: 40px;
  }
`;

const ButtonText = styled.div`
  height: 100%;
  position: absolute;
  left: 10px;
  top: 10px;
`;

const TextIcon = styled(Flex)`
  position: absolute;
  height: 100%;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;

  & #icon {
    margin-right: 10px;
    margin-left: 5px;
    margin-top: 2px;
  }
  & #text {
    margin-left: 10px;
    margin-right: 5px;
    flex-grow: 2;
  }
`;

const ButtonWithIcon = (props) => {
  return (
    <ButtonContainer
      css={props.addCss}
      width={props.width}
      height={props.height}
      onClick={props.onClick}
    >
      <ButtonBack width={props.width} height={props.height}>
        <ButtonFront width={props.width} height={props.height} />
      </ButtonBack>
      <TextIcon>
        <div id="text">{props.children}</div>
        <div id="icon">{props.icon}</div>
      </TextIcon>
      {/* <ButtonFront /> */}
    </ButtonContainer>
  );
};

export default ButtonWithIcon;
