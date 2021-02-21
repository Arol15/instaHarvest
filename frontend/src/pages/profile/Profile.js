import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import Spinner from "../../components/UI/Spinner";
import useModal from "../../hooks/useModal";
import ProfileField from "./ProfileField";
import EmailConfirmIcon from "../../components/UI/EmailConfirmIcon";

import "./Profile.css";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [
    loadingEmailReq,
    dataEmailReq,
    errorEmailReq,
    errorNumEmailReq,
    sendEmailRequest,
  ] = useRequest();

  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    timeOut: 7000,
    inPlace: false,
  });

  const history = useHistory();

  useEffect(() => {
    sendRequest("/api/account/get_profile_private", "POST", {}, true);
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

  useEffect(() => {
    if (errorEmailReq) {
      showModal(errorEmailReq, "mdl-error");
    } else if (dataEmailReq && dataEmailReq.msg) {
      showModal(dataEmailReq.msg, "mdl-ok");
    }
  }, [dataEmailReq, errorEmailReq, errorNumEmailReq]);

  const updateProfileData = () => {
    sendRequest("/api/account/get_profile_private", "POST", {}, true);
  };

  const sendMessage = (msg, classes) => {
    showModal(msg, classes);
  };

  const resendConfirmEmail = () => {
    sendEmailRequest("/api/auth/resend_email", "POST", {}, true);
  };
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
            <div className="prf-field">
              <ProfileField
                name="first_name"
                title="First name"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.first_name}
              >
                <p>{profileData.first_name}</p>
              </ProfileField>
            </div>
            <div className="prf-field">
              <ProfileField
                name="profile_addr"
                title="Profile address"
                api="/edit_profile_address"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.profile_addr}
              >
                <p>
                  <a
                    onClick={() => {
                      history.push(`/profile/${profileData.profile_addr}`);
                    }}
                  >
                    https://instaharvest.com/{profileData.profile_addr}
                  </a>
                </p>
              </ProfileField>
            </div>
          </div>

          <div className="prf-block">
            <h2>Private information</h2>
            <div className="prf-field">
              <ProfileField
                name="new_email"
                title="Email"
                api="/request_change_email"
                method="POST"
                update={updateProfileData}
                sendMsg={sendMessage}
                user={profileData.email}
                value={profileData.email}
              >
                <div>
                  <EmailConfirmIcon email_verified={profileData.email_verified}>
                    <p className="inline-block">{profileData.email}</p>
                  </EmailConfirmIcon>
                </div>
                <p></p>
              </ProfileField>

              {!profileData.email_verified && (
                <div>
                  <a onClick={resendConfirmEmail}>Resend confirmation email</a>
                </div>
              )}
            </div>
            <div className="prf-field">
              <ProfileField
                name="last_name"
                title="Last name"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.last_name}
              >
                <p>{profileData.last_name}</p>
              </ProfileField>
            </div>
          </div>

          <div className="prf-block">
            <div className="prf-field">
              <ProfileField
                name="address"
                title="Address"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.address}
              >
                <p>{profileData.address}</p>
              </ProfileField>
            </div>
            <div className="prf-field">
              <ProfileField
                name="city"
                title="City"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.city}
              >
                <p>{profileData.city}</p>
              </ProfileField>
            </div>
            <div className="prf-field">
              <ProfileField
                name="state"
                title="State"
                api="/edit_profile"
                method="PATCH"
                type="state"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.state}
              >
                <p>{profileData.state}</p>
              </ProfileField>
            </div>
            <div className="prf-field">
              <ProfileField
                name="zip_code"
                title="Zip code"
                api="/edit_profile"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.zip_code}
              >
                <p>{profileData.zip_code}</p>
              </ProfileField>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
