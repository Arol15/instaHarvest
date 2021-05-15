import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useModal } from "../hooks/hooks";

import AuthModal from "../components/auth/AuthModal";
import DropDownMenu from "../components/UI/DropDownMenu";
import { Button, ButtonLink, ButtonLinkMenu } from "./styled/styled";

import { checkAuth, logout } from "../utils/utils";
import { selectProfile } from "../store/profileSlice";
import { isHomePage } from "../store/currentPageSlice";
import { showMsg } from "../store/modalSlice";
import styled from "styled-components/macro";

const MainNavbarStyled = styled.div`
  position: sticky;
  height: 80px;
  z-index: 50;
  align-items: center;
  background: ${({ theme }) => theme.mainColor};
  background-image: ${({ theme }) => `linear-gradient(
    135deg,
    ${theme.mainColor2} 0%,
    ${theme.mainColor} 54%,
    ${theme.mainColor2} 98%`} 
  );
  transition: all 0.5s ease-in-out;
  transition-delay: color 0.25;
  top: 0;
  transform: translateY(${(props) => (props.show ? "0" : "-100%")});

  width: 100%;
  display: flex;
  top: ${(props) => (props.show && props.isHome ? "20px" : "0")};
  ${(props) =>
    props.isHome &&
    `
    height: 60px;
    margin-left: 20px;
  width: 400px;
  border-radius: 30px;
  background-color: #ffffffaf;
  background-image: none;

  @media (max-width: 440px) {
    margin: 20px auto;
    width: 80%;
  }
  `}
`;

const Logo = styled.div`
  margin-left: 10px;
  margin-right: auto;
  font-family: "Lobster", cursive;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.secondaryTextColor};
  transition: 0.25s;

  &:hover {
    color: black;
  }
`;

const NavbarLink = styled(ButtonLink)`
  text-decoration-line: none;
  color: ${({ theme }) => theme.secondaryTextColor};
  transition: 0.25s;

  &:hover {
    color: black;
  }
`;

const ProfileIcon = styled.img`
  padding: 0 20px;
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

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
    setShowProfileMenu(false);
  };

  const confirmLogout = (
    <>
      <p>Are you sure to logout?</p>
      <Button onClick={() => logoutUser(true)}>Yes</Button>
      <Button onClick={() => logoutUser(false)}>No</Button>
    </>
  );

  const onClickProfile = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setShowNavbar(true);
    }, 500);

    return () => {
      clearTimeout(id);
    };
  });

  return (
    <>
      <MainNavbarStyled isHome={isHome} show={showNavbar}>
        <Logo
          onClick={() => {
            history.push("/");
          }}
        >
          InstaHarvest
        </Logo>

        <NavbarLink
          onClick={() => {
            history.push("/add-product");
          }}
        >
          Share Product
        </NavbarLink>

        {checkAuth() ? (
          <>
            <DropDownMenu
              open={showProfileMenu}
              button={
                <div>
                  <ProfileIcon
                    src={image_url}
                    onClick={onClickProfile}
                    alt=""
                  />
                </div>
              }
              onClick={onClickProfile}
            >
              <ButtonLinkMenu
                onClick={() => {
                  onClickProfile();
                  history.push("/profile");
                }}
              >
                Profile
              </ButtonLinkMenu>

              <ButtonLinkMenu
                onClick={() => {
                  showModal(confirmLogout);
                }}
              >
                Logout
              </ButtonLinkMenu>
            </DropDownMenu>
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
