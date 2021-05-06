import styled from "styled-components";

export const Button = styled.button`
  font-family: "Lora", serif;
  background: ${(props) =>
    props.active ? props.theme.buttonDisabledColor : props.theme.buttonColor};
  outline: none;
  color: ${(props) =>
    props.color ? props.color : props.theme.buttonTextColor};
  border: 0;
  padding: 8px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease-in-out;

  &:hover {
    background: ${(props) =>
      props.active
        ? props.theme.buttonDisabledColor
        : props.theme.buttonHoverColor};
  }
`;

export const ButtonLink = styled.button`
  font-family: "Lora", serif;
  color: ${(props) => (props.color ? props.color : props.theme.linkColor)};
  text-decoration-line: underline;
  cursor: pointer;
  background: none;
  margin: 0px !important;
  padding: 8px;

  &:hover {
    background: #bd320000;
  }
`;

export const ButtonLinkMenu = styled(ButtonLink)`
  color: #ffffff;
  padding: 10px 0;
`;

export const ButtonIcon = styled.button`
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
`;

export const ButtonCircleIcon = styled.button`
  background-color: hsla(0, 0%, 0%, 0.562);
  color: white;
  border-radius: 50%;
  margin: 0 auto;
  width: 34px;
  height: 34px;
  cursor: pointer;
  margin-bottom: 0;
  bottom: 0;
  transition: 0.25s ease-in-out;

  &:hover {
    background-color: #000000b7;
  }
`;
