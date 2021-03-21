import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import { loadJSON, logout, checkAuth } from "../../utils/localStorage";
import PublicProfileInfo from "./PublicProfileInfo";
import UserChatsPage from "../chat/UserChatsPage";
import UserProducts from "../product/UserProducts";
import classnames from "classnames";
import "./profile.css";

const Profile = ({ tab }) => {
  const history = useHistory();
  const [data] = useState(loadJSON("app_data"));
  const [currTab, setCurrTab] = useState(tab ? tab : "products");

  useEffect(() => {
    if (checkAuth() === false || !data) {
      logout();
      history.push("/login");
    }
  }, []);

  return (
    <>
      {data && (
        <div className="profile">
          <ProfileHeader edit={false} />
          <PublicProfileInfo
            firstName={data.first_name}
            emailVerified={data.email_verified}
            city={data.city}
            usState={data.us_state}
            joined={data.joined}
          />
          <button
            onClick={() => {
              history.push("/profile/edit");
            }}
          >
            Edit profile
          </button>
          <div className="prf-main-menu">
            <hr className="hr-top" />
            <div className="prf-main-menu-tabs">
              <div
                onClick={() => {
                  history.push("/profile");
                  setCurrTab("products");
                }}
                className={classnames({
                  "prf-main-menu-active": currTab === "products",
                })}
              >
                Products
              </div>
              <div
                onClick={() => {
                  history.push("/chats");
                  setCurrTab("chats");
                }}
                className={classnames({
                  "prf-main-menu-active": currTab === "chats",
                })}
              >
                Chats
              </div>
            </div>
            <hr className="hr-bottom" />
          </div>
          <div className="prf-body">
            {currTab === "chats" && <UserChatsPage />}
            {currTab === "products" && <UserProducts />}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
