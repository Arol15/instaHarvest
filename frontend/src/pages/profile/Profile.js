import { useState, useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Spinner from "../../components/UI/Spinner";
import useModal from "../../hooks/useModal";
import ProfileField from "./ProfileField";
import { Icon, InlineIcon } from "@iconify/react";
import baselineVerified from "@iconify-icons/ic/baseline-verified";
import outlineVerified from "@iconify-icons/ic/outline-verified";

import "./Profile.css";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    timeOut: 7000,
    inPlace: false,
  });

  useEffect(() => {
    sendRequest("api/account/get_profile_private", "POST", {}, true);
  }, [updateProfile]);

  useEffect(() => {
    if (data) {
      setProfileData({ ...data });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      showModal(error, "mdl-error");
    } else if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
    }
  }, [error, errorNum, data]);

  const updateProfileData = () => {
    sendRequest("api/account/get_profile_private", "POST", {}, true);
  };

  const sendMessage = (msg, classes) => {
    showModal(msg, classes);
  };

  const resendConfrimEmail = () => {};

  return (
    <>
      {isLoading && <Spinner />}

      {modal}
      {profileData && (
        <div>
          <h1>Profile</h1>
          <h2>Public Information</h2>
          <div></div>
          <img src={profileData.image_url} />
          <button>Edit</button>

          <div className="prf-block">
            <ProfileField
              name="first_name"
              title="First name"
              api="/edit_profile"
              method="PATCH"
              update={updateProfileData}
              sendMsg={sendMessage}
            >
              {profileData.first_name}
            </ProfileField>
            <ProfileField
              name="profile_addr"
              title="Profile address"
              api="/edit_profile_address"
              method="PATCH"
              update={updateProfileData}
              sendMsg={sendMessage}
              prefix={"https://instaharvest.com/"}
            >
              {profileData.profile_addr}
            </ProfileField>
          </div>

          <div className="prf-block">
            <h2>Private information</h2>
            <div>
              <ProfileField
                name="new_email"
                title="Email"
                api="/request_change_email"
                method="POST"
                update={updateProfileData}
                sendMsg={sendMessage}
                user={profileData.email}
                prefix={
                  <Icon
                    icon={
                      profileData.email_verified
                        ? baselineVerified
                        : outlineVerified
                    }
                    width="30"
                    height="30"
                    color={profileData.email_verified && "#4E9340"}
                  />
                }
              >
                {profileData.email}
              </ProfileField>
              {/* <link onClick={}>Resend confirmation email</link> */}

              <ProfileField
                name="last_name"
                title="Last name"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
              >
                {profileData.last_name}
              </ProfileField>
            </div>

            <div>
              <ProfileField
                name="address"
                title="Address"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
              >
                {profileData.address}
              </ProfileField>
              <ProfileField
                name="city"
                title="City"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
              >
                {profileData.city}
              </ProfileField>
              <ProfileField
                name="state"
                title="State"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
              >
                {profileData.state}
              </ProfileField>
              <ProfileField
                name="zip_code"
                title="Zip code"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
              >
                {profileData.zip_code}
              </ProfileField>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
