import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useModal } from "../hooks/hooks";

import AuthModal from "../components/auth/AuthModal";
import DropDownMenu from "../components/UI/DropDownMenu";
import { Button, ButtonLink, ButtonLinkMenu } from "./styled/buttons";

import { checkAuth, logout } from "../utils/utils";
import { selectProfile } from "../store/profileSlice";
import { showMsg } from "../store/modalSlice";
import "./MainNavbar.css";

const MainNavbar = () => {
  const history = useHistory();
  const { image_url } = useSelector(selectProfile, shallowEqual);
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
      <nav className="main-navbar">
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
      </nav>
      {modal}
    </>
  );
};

export default MainNavbar;
