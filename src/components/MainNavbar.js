import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useModal, useScreen } from "../hooks/hooks";

import AuthModal from "../components/auth/AuthModal";
import DropDownMenu from "../components/UI/DropDownMenu";
import { Button, ButtonLink, Flex } from "./styled/styled";
import { IoIosArrowDown } from "react-icons/io";

import { checkAuth, logout } from "../utils/utils";
import { selectProfile } from "../store/profileSlice";
import { isHomePage } from "../store/currentPageSlice";
import { showMsg } from "../store/modalSlice";
import styled from "styled-components/macro";

const MainNavbarStyled = styled.div`
  position: sticky;
  height: 80px;
  z-index: 50;

  // align-items: center;
  background: ${({ theme }) => theme.mainColor};
  background-image: ${({ theme }) => `linear-gradient(
    135deg,
    ${theme.mainColor2} 0%,
    ${theme.mainColor} 54%,
    ${theme.mainColor2} 98%`} 
  );
  transition: all 0.5s ease-in-out;
  // transition-delay: width 0.5s;
  transform: translateY(${(props) => (props.showNavbar ? "0" : "-200%")});
    
  width: 100%;
  display: flex;
  align-items: flex-start;
  top: ${(props) => (props.showNavbar && props.isHome ? "20px" : "0")};

  & > * {
    margin-top: ${(props) => (props.isHome ? "13px" : "25px")};;
  }

  ${(props) =>
    props.isHome &&
    `
    height: ${props.align === "vert" && props.showMenu ? "190" : "60"}px;
    margin-left: 20px;
    width: ${props.align === "hor" && props.showMenu ? "760" : "400"}px;
    border-radius: 30px;
    background-color: #ffffffd5;
    background-image: none;

    @media (max-width: 440px) {
      margin: 20px auto;
      width: 80%;
    }
  `}
`;

const Logo = styled.div`
  margin-left: ${({ isHome }) => (isHome ? "20" : "40")}px;
  margin-right: auto;
  font-family: "Lobster", cursive;
  font-size: 24px;
  cursor: pointer;
  color: black;
  transition: 0.25s;

  &:hover {
    color: ${({ theme }) => theme.secondaryTextColor};
  }

  @media (max-width: 640px) {
    margin-left: 20px;
  }
`;

const NavbarLink = styled(ButtonLink)`
  text-decoration-line: none;
  transition: 0.25s;
`;

const ProfileIcon = styled.img`
  padding: 0 20px;
  transition: all 0.5s ease-in-out;
  margin-right: ${(props) => {
    if (!props.isHome) {
      return `20px`;
    } else {
      return props.show && props.align === "hor" ? "360px" : "0";
    }
  }};
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;

  ${(props) =>
    !props.isHome &&
    `@media (max-width: 640px) {
    margin-right: 0px;
  }`}
`;

const MenuArrow = styled.div`
  position: absolute;
  right: 30px;
  bottom: -5px;
  transition: 0.25s;
  cursor: pointer;
  color: black;

  &:hover {
    color: ${({ theme }) => theme.secondaryTextColor};
  }

  ${(props) => {
    if (!props.isHome) {
      return `
        bottom: 0;
        opacity: 0;
        visibility: hidden;`;
    } else {
      if (props.align === "hor") {
        if (props.show) {
          return `
            right: 8px;
            bottom: 18px;
            transform: rotate(90deg);
            `;
        } else {
          return `
          transform-origin: top left;
          transform: rotate(-90deg);
          right: 8px;
          bottom: 0;
        }`;
        }
      }
      if (props.align === "vert" && props.show) {
        return `
        transform: rotate(180deg);
        bottom: 5px;
        `;
      }
    }
  }}
`;

const MenuItemsStyled = styled(Flex)`
  font-size: 1.1rem;
  flex-direction: ${(props) => (props.align === "vert" ? "column" : "row")};
  text-align: ${(props) => (props.align === "vert" ? "right" : null)};
  position: absolute;
  right: 20px;
  opacity: ${(props) => (props.show ? "1" : "0")};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transition: all 0.25s;
  transition-delay: ${(props) => (props.show ? "0.25" : "0")}s;
  top: ${(props) => (props.align === "vert" ? "40px" : null)};

  ${NavbarLink} {
    color: black;
    text-align: inherit;
  }

  ${NavbarLink}:hover {
    color: ${({ theme }) => theme.secondaryTextColor};
  }

  ${(props) =>
    props.align === "vert" &&
    `
    ${NavbarLink} {
      padding: 0;
      padding-bottom: 15px;
    }
    ${NavbarLink}:first-child {
      padding-top: 20px;
    }
    `}
`;

const Share = styled(Flex)`
  width: 50px;
  height: 50px;
  border: 5px solid ${({ theme }) => theme.buttonColor};
  border-radius: 50%;
  margin-top: 0;
  transition: all 0.5s;
  visibility: visible;
  opacity: 1;
  transform: scale(1);
  @media (max-width: 600px) {
    visibility: hidden;
    opacity: 0;
    transform: scale(0);
  }
`;

const MainNavbar = () => {
  const history = useHistory();
  const { image_url } = useSelector(selectProfile, shallowEqual);
  const isHome = useSelector(isHomePage);
  const dispatch = useDispatch();
  const { modal, showModal, closeModal } = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
    disableClose: true,
  });
  const { screenWidth } = useScreen();

  const [showMenu, setShowMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [navbarAlign, setNavbarAlign] = useState(
    screenWidth > 920 ? "hor" : "vert"
  );

  const logoutUser = (val) => {
    if (val) {
      logout()
        .then(() => {
          history.push("/");
        })
        .catch((error) => {
          dispatch(
            showMsg({
              open: true,
              msg: error,
              type: "error",
            })
          );
        });
    }
    closeModal();
    setShowMenu(false);
  };

  const confirmLogout = (
    <>
      <p>Are you sure to logout?</p>
      <Button onClick={() => logoutUser(true)}>Yes</Button>
      <Button onClick={() => logoutUser(false)}>No</Button>
    </>
  );

  const onClickMenu = () => {
    setShowMenu(!showMenu);
  };

  const menuItems = useMemo(() => {
    return (
      <>
        <NavbarLink
          onClick={() => {
            setShowMenu(false);
            history.push("/profile");
          }}
        >
          Profile
        </NavbarLink>

        <NavbarLink
          onClick={() => {
            setShowMenu(false);
            history.push("/add-product");
          }}
        >
          Share Product
        </NavbarLink>

        <NavbarLink
          onClick={() => {
            setShowMenu(false);
            showModal(confirmLogout);
          }}
        >
          Logout
        </NavbarLink>
      </>
    );
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setShowNavbar(true);
    }, 500);

    return () => {
      clearTimeout(id);
    };
  });

  useEffect(() => {
    if (screenWidth > 920) {
      setNavbarAlign("hor");
    } else {
      if (showMenu) {
        setShowMenu(false);
      }
      setNavbarAlign("vert");
    }
  }, [screenWidth]);

  useEffect(() => {
    setShowMenu(false);
  }, [isHome]);

  return (
    <>
      <MainNavbarStyled
        isHome={isHome}
        showNavbar={showNavbar}
        showMenu={showMenu}
        width={screenWidth}
        align={navbarAlign}
      >
        <Logo
          isHome={isHome}
          onClick={() => {
            history.push("/");
          }}
        >
          InstaHarvest
        </Logo>
        <Share></Share>

        {checkAuth() ? (
          <>
            <Flex>
              <ProfileIcon
                show={showMenu}
                isHome={isHome}
                align={navbarAlign}
                src={image_url}
                onClick={onClickMenu}
                alt=""
              />
              {isHome ? (
                <MenuItemsStyled align={navbarAlign} show={showMenu}>
                  {menuItems}
                </MenuItemsStyled>
              ) : (
                <DropDownMenu
                  open={showMenu}
                  onClick={onClickMenu}
                  styles={`
                  right: 40px;

                  @media (max-width: 640px) {
                    right: 20px;
                  }

                `}
                >
                  {menuItems}
                </DropDownMenu>
              )}
              <MenuArrow
                onClick={onClickMenu}
                show={showMenu}
                align={navbarAlign}
                isHome={isHome}
              >
                <IoIosArrowDown />
              </MenuArrow>
            </Flex>
          </>
        ) : (
          <NavbarLink
            onClick={() =>
              showModal(
                <AuthModal
                  closeModal={closeModal}
                  afterConfirm={() => {
                    closeModal();
                    history.push("/profile");
                  }}
                />
              )
            }
          >
            Sign In
          </NavbarLink>
        )}
      </MainNavbarStyled>

      {modal}
    </>
  );
};

export default MainNavbar;
