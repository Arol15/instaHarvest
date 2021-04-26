import { useState, useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRequest } from "../../hooks/hooks";

import ProfileHeader from "./ProfileHeader";
import PublicProfileInfo from "./PublicProfileInfo";
import UserChatsPage from "../chat/UserChatsPage";
import UserProducts from "../product/UserProducts";
import TabsMenu from "../UI/TabsMenu";

import { datetimeToLocal } from "../../utils/datetime";
import { logout, checkAuth } from "../../utils/localStorage";
import { showMsg } from "../../store/modalSlice";
import { updateProfile, selectProfile } from "../../store/profileSlice";
import "./profile.css";

const Profile = ({ tab }) => {
  const history = useHistory();
  const [currTab, setCurrTab] = useState(tab ? tab : "products");
  const profileData = useSelector(selectProfile, shallowEqual);
  const dispatch = useDispatch();
  const { data, error, errorNum, sendRequest } = useRequest();

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {profileData && (
        <div className="profile">
          <ProfileHeader edit={false} />
          <PublicProfileInfo
            firstName={profileData.first_name}
            emailVerified={profileData.email_verified}
            city={profileData.city}
            country={profileData.country}
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
          <TabsMenu
            currTab={currTab}
            tabs={[
              {
                title: "Products",
                name: "products",
                onClick: () => {
                  history.push("/profile");
                  setCurrTab("products");
                },
              },
              {
                title: "Chats",
                name: "chats",
                onClick: () => {
                  history.push("/chats");
                  setCurrTab("chats");
                },
              },
            ]}
          />

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
