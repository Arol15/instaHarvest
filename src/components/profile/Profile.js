import { useState, useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRequest } from "../../hooks/hooks";
import ProfileHeader from "./ProfileHeader";
import { logout, checkAuth } from "../../utils/localStorage";
import PublicProfileInfo from "./PublicProfileInfo";
import UserChatsPage from "../chat/UserChatsPage";
import UserProducts from "../product/UserProducts";
import classnames from "classnames";
import { datetimeToLocal } from "../../utils/datetime";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { showMsg } from "../../store/modalSlice";
import { updateProfile, selectProfile } from "../../store/profileSlice";
import "./profile.css";

const Profile = ({ tab }) => {
  const history = useHistory();
  const [currTab, setCurrTab] = useState(tab ? tab : "products");
  const profileData = useSelector(selectProfile, shallowEqual);
  const dispatch = useDispatch();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  useLayoutEffect(() => {
    if (checkAuth() === false) {
      logout()
        .then(() => {
          history.push("/login");
        })
        .catch(() => {});
    } else {
      sendRequest("/api/account/get_profile_private", "POST", {});
    }
  }, []);

  useEffect(() => {
    if (data && data.msg) {
      dispatch(showMsg({ open: true, msg: data.msg, classes: "mdl-ok" }));
    } else if (data) {
      dispatch(updateProfile({ ...data }));
    }
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error, errorNum]);

  return (
    <>
      {profileData && (
        <div className="profile">
          <ProfileHeader edit={false} />
          <PublicProfileInfo
            firstName={profileData.first_name}
            emailVerified={profileData.email_verified}
            city={profileData.city}
            usState={profileData.us_state}
            joined={datetimeToLocal(profileData.created_at, "month-year")}
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
