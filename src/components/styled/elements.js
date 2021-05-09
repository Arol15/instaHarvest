import styled from "styled-components/macro";
import { FlexRow } from "./flexbox";

export const ContainerWithBackground = styled.div`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondaryBackgroundColor};
`;

export const ContainerWithBorder = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.borderColor};
`;

export const CircleContainer = styled.div`
  position: absolute;
  text-align: center;
  margin: 5px;
  height: 60px;
  width: 60px;
  background-color: #1c1c1c69;
  border-radius: 50%;
  cursor: ${(props) => (props.cursor ? "pointer" : "default")};
  ${(props) => (props.position.includes("top") ? "top: 0;" : null)}
  ${(props) => (props.position.includes("left") ? "left: 0;" : null)}
  ${(props) => (props.position.includes("bottom") ? "bottom: 0;" : null)}
  ${(props) => (props.position.includes("right") ? "right: 0;" : null)} 
  transition: 0.5s;

  > p {
    margin-block-start: 0em;
    margin-block-end: 0em;
    color: hsl(0, 0%, 100%);
    font-size: 0.8rem;
    margin-top: -5px;
  }

  p:first-child {
    padding-top: 20px;
  }
`;

export const IconInsideCircleContainer = styled.img`
  padding-top: 15px;
  width: 30px;
  height: 30px;
  transition: 0.25s;

  ${(props) =>
    props.favorites ? "width: 26px; height: 26px; padding-top: 12px;" : null}
`;

export const ProductsGrid = styled(FlexRow)`
  margin: 20px 40px;
  ${(props) => (props.hide ? "display: none;" : null)}
`;

export const MainContainer = styled.div`
  padding: 0 20px;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
`;

export const ContainerWithForm = styled(MainContainer)`
  label {
    text-align: left;
    display: block;
    margin: 15px 0;
  }

  h2 {
    font-size: 30px;
    color: ${({ theme }) => theme.buttonColor};
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 6px 10px;
    box-sizing: border-box;
    display: block;
  }

  textarea {
    resize: none;
    border-radius: 10px;
  }
`;

export const StyledProfileField = styled.div`
  padding: 10px;
  word-break: break-all;

  hr {
    margin-top: 15px;
    border: 0;
    height: 1px;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0)
    );
  }

  > input {
    margin: 10px 0;
    margin-left: -10px;
    max-width: 100%;
  }
`;
