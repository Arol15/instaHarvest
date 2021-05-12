import { useState } from "react";

import styled from "styled-components/macro";

const Switch = styled.div`
  position: relative;
  display: block;
  width: 90px;
  height: 34px;
  background-color: ${({ theme }) => theme.buttonColor};
  border-radius: 34px;
  margin: auto;

  & input[type="number"]::-webkit-inner-spin-button,
  & input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const SwitchInner = styled.span`
  position: absolute;
  margin: 4px;
  height: 26px;
  width: ${({ pos }) => (pos === "left" ? "90px" : "40px")};
  cursor: pointer;
  left: 0;
`;

const SwitchText = styled.span`
  z-index: 1;
  position: absolute;
  opacity: ${({ pos }) => (pos === "left" ? "1" : "0")};
  text-align: center;
  margin: 8px;
  transition: 0.5s;
  left: ${({ pos }) => (pos === "left" ? "0px" : "43px")};
  font-size: 0.9rem;
`;

const Slider = styled.span`
  position: absolute;
  margin: 4px;
  height: 26px;
  width: 40px;
  border-radius: 34px;
  background-color: white;
  transition: 0.5s;
  left: ${({ pos }) => (pos === "left" ? "0" : "43px")};
`;

const Input = styled.input`
  z-index: 2;
  position: absolute;
  opacity: ${({ pos }) => (pos === "left" ? "0" : "1")};
  outline: none;
  text-align: center;
  border: none;
  margin: 4px;
  height: 26px;
  width: 40px !important;
  border-radius: 34px;
  background-color: white;
  transition: 0.5s;
  left: ${({ pos }) => (pos === "left" ? "0" : "43px")};
  visibility: ${({ pos }) => (pos === "left" ? "hidden" : "visible")};

  &:focus {
    box-shadow: none;
  }
`;

const Lable = styled.span`
  display: inline-block;
  position: relative;
  transform: translate(85px, 8px);
  font-size: 0.8rem;
  transition: 0.5s ease-in-out;
  opacity: ${({ pos }) => (pos === "left" ? "0" : "1")};
`;

const ToggleInput = ({
  name,
  handleInputChange,
  inputValue,
  formData,
  setFormData,
}) => {
  const [pos, setPos] = useState(inputValue > 0 ? "right" : "left");

  const onClick = () => {
    if (pos === "left") {
      setPos("right");
    } else {
      setFormData({ ...formData, [name]: 0 });
      setPos("left");
    }
  };

  return (
    <Switch className="switch">
      <SwitchInner pos={pos} onClick={onClick}></SwitchInner>
      <SwitchText pos={pos}>Free</SwitchText>
      <Slider pos={pos}></Slider>
      <Input
        pos={pos}
        type="number"
        name={name}
        placeholder={"$"}
        onChange={handleInputChange}
        value={inputValue}
      ></Input>
      <Lable pos={pos}>Enter price</Lable>
    </Switch>
  );
};

export default ToggleInput;
