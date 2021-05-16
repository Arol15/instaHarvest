import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useScreen } from "../../hooks/hooks";

import { FiUser, FiUsers, FiHome, FiMenu, FiX } from "react-icons/fi";

import styled from "styled-components/macro";

const StyledSideMenu = styled.div`
  position: absolute;
  text-align: left;
  width: ${(props) => (props.closed ? "50px" : "220px")};
  height: 300px;

  p {
    cursor: pointer;
    font-size: 1.1rem;
  }

  span {
    margin-right: 5px;
  }
`;

const MenuBody = styled.div`
  z-index: 3;
  margin-left: 15px;
  margin-top: 20px;
  position: absolute;
  color: ${({ theme }) => theme.secondaryTextColor};
`;

const MenuButton = styled.div`
  width: fit-content;
  visibility: visible;
  transition: 0.25s ease-in-out;
  cursor: pointer;
  color: ${({ theme }) => theme.textColor};
`;

const MenuItem = styled.p`
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) =>
    props.active
      ? props.theme.activeTextColor
      : props.theme.secondaryTextColor};
`;

const MenuElementTitle = styled.span`
  opacity: ${(props) => (props.hide ? "0" : "1")};
  transition: opacity 0.25s;
  transition-delay: 300ms;
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
  ${(props) => (props.hide ? "position: absolute;" : null)};
`;

const MenuBack = styled.div`
  position: absolute;
  border-radius: 0 20px 20px 0;
  z-index: 2;
  height: 300px;
  width: ${(props) => (props.hide ? "50" : "230")}px;
  transition: 0.5s ease;

  background: ${({ theme }) => theme.mainColor};
  background-image: ${({ theme }) => `linear-gradient(
    135deg,
    ${theme.mainColor2} 0%,
    ${theme.mainColor} 54%,
    ${theme.mainColor2} 98%`} 
  );

  box-shadow: 5px 0 5px ${({ theme }) => theme.shadowColor};
  ${(props) => props.hide && "box-shadow: none;"}
`;

const ProfileSideMenu = ({ currTab }) => {
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const { isDesktop } = useScreen(1300);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeOnMobile = () => {
    if (!isDesktop) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    setShowMenu(isDesktop);
  }, [isDesktop]);

  return (
    <StyledSideMenu closed={!showMenu}>
      <MenuBody>
        <MenuButton onClick={toggleMenu}>
          {showMenu ? <FiX /> : <FiMenu />}
        </MenuButton>

        <MenuItem
          active={!currTab}
          onClick={() => {
            currTab && history.push("/profile/edit");
            closeOnMobile();
          }}
        >
          <span>
            <FiUsers />
          </span>

          <MenuElementTitle hide={!showMenu}>
            Public information
          </MenuElementTitle>
        </MenuItem>

        <MenuItem
          active={currTab === "private"}
          onClick={() => {
            currTab !== "private" && history.push("/profile/edit/private");
            closeOnMobile();
          }}
        >
          <span>
            <FiUser />
          </span>
          <MenuElementTitle hide={!showMenu}>
            Private information
          </MenuElementTitle>
        </MenuItem>

        <MenuItem
          active={currTab === "address"}
          onClick={() => {
            currTab !== "address" && history.push("/profile/edit/address");
            closeOnMobile();
          }}
        >
          <span>
            <FiHome />
          </span>
          <MenuElementTitle hide={!showMenu}>Address</MenuElementTitle>
        </MenuItem>
      </MenuBody>

      <MenuBack hide={!showMenu}></MenuBack>
      {/* <MenuBackRight hide={!showMenu}></MenuBackRight> */}
    </StyledSideMenu>
  );
};

export default ProfileSideMenu;
