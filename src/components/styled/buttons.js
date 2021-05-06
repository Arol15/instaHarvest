import styled from "styled-components";

export const Button = styled.button`
  font-family: "Lora", serif;
  background: ${(props) => (props.active ? "#e89a7d" : "#ff4400")};
  outline: none;
  color: ${(props) => (props.color ? props.color : "#ffffff")};
  border: 0;
  padding: 8px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.25s ease-in-out;

  &:hover {
    background: ${(props) => (props.active ? "#e89a7d" : "#bd3200")};
  }
`;

export const ButtonLink = styled.button`
  font-family: "Lora", serif;
  color: ${(props) => (props.color ? props.color : "#0377b5")};
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
