import { useHistory, Link } from "react-router-dom";
import "./MainNavbar.css";
import { checkAuth, loadJSON, logout } from "../utils/localStorage";
import { useModal } from "../hooks/hooks";
import AuthModal from "../components/auth/AuthModal";

const MainNavbar = () => {
  const history = useHistory();

  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

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

  return (
    <>
      <nav className="main-navbar">
        <div>
          <Link to="/">instaHarvest</Link>
        </div>
        <div>
          <Link to="/add-product">Share your Product</Link>
        </div>
        {checkAuth() ? (
          <div className="main-navbar-links">
            <div>{loadJSON("app_data").first_name}</div>
            <a onClick={() => showModal(confirmLogout)}>Logout</a>
          </div>
        ) : (
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
