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
import "./MainNavbar.css";
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
  // left: 20px;
  width: 100%;
  display: flex;
  ${(props) =>
    props.isHome &&
    `
    height: 60px;
    top: 20px;
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

  return (
    <>
      <MainNavbarStyled isHome={isHome} className="main-navbar">
        <div className="main-navbar-logo">
          <Link to="/">instaHarvest</Link>
        </div>
        <div>
          <Link to="/add-product">Share your Product</Link>
        </div>
        {checkAuth() ? (
          <>
            <DropDownMenu
              open={showProfileMenu}
              button={
                <div>
                  <img
                    className="main-navbar-profile"
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
          <div className="main-navbar-links">
            <ButtonLink
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
            </ButtonLink>
          </div>
        )}
      </MainNavbarStyled>
      {modal}
    </>
  );
};

export default MainNavbar;
