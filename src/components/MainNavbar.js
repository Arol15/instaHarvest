import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./MainNavbar.css";
import { checkAuth, loadJSON, logout } from "../utils/localStorage";
import { useModal } from "../hooks/hooks";
import AuthModal from "../components/auth/AuthModal";
import DropDownMenu from "../components/UI/DropDownMenu";

const MainNavbar = () => {
  const history = useHistory();

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
                    src={loadJSON("app_data").image_url}
                    onClick={onClickProfile}
                  />
                </div>
              }
              onClick={onClickProfile}
            >
              <a
                onClick={() => {
                  history.push("/profile");
                }}
              >
                Profile
              </a>
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
          // <a onClick={() => showModal(confirmLogout)}>Logout</a>

          <div className="main-navbar-links">
            <a onClick={() => showModal(<AuthModal />)}>Sign In</a>
          </div>
        )}
      </nav>
      {modal}
    </>
  );
};

export default MainNavbar;
