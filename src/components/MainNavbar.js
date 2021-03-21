import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./MainNavbar.css";
import { checkAuth, logout } from "../utils/localStorage";
import { useModal } from "../hooks/hooks";
import AuthModal from "../components/auth/AuthModal";
import DropDownMenu from "../components/UI/DropDownMenu";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile } from "../store/profileSlice";
import { selectSpinner } from "../store/spinnerSlice";

const MainNavbar = () => {
  const history = useHistory();
  const { image_url } = useSelector(selectProfile);
  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logoutUser = (val) => {
    if (val) {
      logout();
      history.push("/");
    }
    closeModal();
    setShowProfileMenu(false);
  };

  const confirmLogout = (
    <>
      <p>Are you sure to logout?</p>
      <button onClick={() => logoutUser(true)}>Yes</button>
      <button onClick={() => logoutUser(false)}>No</button>
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
              <Link onClick={onClickProfile} to="/profile">
                Profile
              </Link>

              <a
                onClick={() => {
                  showModal(confirmLogout);
                }}
              >
                Logout
              </a>
            </DropDownMenu>
          </>
        ) : (
          <div className="main-navbar-links">
            <a onClick={() => showModal(<AuthModal closeModal={closeModal} />)}>
              Sign In
            </a>
          </div>
        )}
      </nav>
      {modal}
    </>
  );
};

export default MainNavbar;
