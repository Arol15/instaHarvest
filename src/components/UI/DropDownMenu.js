import { useEffect, useRef } from "react";

import { FlexColumn } from "../styled/styled";

import styled from "styled-components/macro";

const MenuContainer = styled.div`
  position: relative;
`;

const Menu = styled.nav`
  background: ${({ theme }) => theme.menuBackgroundColor};
  border-radius: 15px;
  position: absolute;
  top: 15px;
  right: 20px;
  padding: 0 5px;
  width: max-content;
  box-shadow: 0 1px 8px ${({ theme }) => theme.shadowColor};
  opacity: ${({ active }) => (active ? "1" : "0")};
  visibility: ${({ active }) => (active ? "visible" : "hidden")};
  transform: translateY(${({ active }) => (active ? "0" : "-20px")});
  transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
`;

const MenuElements = styled(FlexColumn)`
  margin: 10px;
  & > * {
    color: white;
  }

  & > *:hover {
    color: ${({ theme }) => theme.secondaryTextColor};
  }
`;

const DropDownMenu = ({ children, open, button, onClick }) => {
  const refer = useRef(null);

  useEffect(() => {
    const clickEvent = (e) => {
      if (refer.current !== null && !refer.current.contains(e.target)) {
        onClick();
      }
    };
    if (open) {
      window.addEventListener("click", clickEvent);

      return () => {
        window.removeEventListener("click", clickEvent);
      };
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MenuContainer>
      {button && button}
      <Menu active={open} ref={refer}>
        <MenuElements>{children}</MenuElements>
      </Menu>
    </MenuContainer>
  );
};

export default DropDownMenu;
