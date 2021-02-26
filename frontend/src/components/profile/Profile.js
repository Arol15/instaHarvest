import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import useRequest from "../../hooks/useRequest";
import Spinner from "../UI/Spinner";
import ProfileField from "./ProfileField";
import EmailConfirmIcon from "../UI/EmailConfirmIcon";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import MainNavbar from "../MainNavbar";
import "./profile.css";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [
    ,
    dataEmailReq,
    errorEmailReq,
    errorNumEmailReq,
    sendEmailRequest,
  ] = useRequest();

  const [, setMsgState] = useContext(ModalMsgContext);

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
      setMsgState({
        open: true,
        msg: error,
        classes: "mdl-error",
      });
    } else if (data && data.msg) {
      setMsgState({
        open: true,
        msg: data.msg,
        classes: "mdl-ok",
      });
    }
  }, [error, errorNum, data]);

  useEffect(() => {
    if (errorEmailReq) {
      setMsgState({
        open: true,
        msg: errorEmailReq,
        classes: "mdl-error",
      });
    } else if (dataEmailReq && dataEmailReq.msg) {
      setMsgState({
        open: true,
        msg: dataEmailReq.msg,
        classes: "mdl-error",
      });
    }
  }, [dataEmailReq, errorEmailReq, errorNumEmailReq]);

  const updateProfileData = () => {
    sendRequest("/api/account/get_profile_private", "POST", {}, true);
  };

  const sendMessage = (msg, classes) => {
    setMsgState({
      open: true,
      msg: msg,
      classes: classes,
    });
  };

  const resendConfirmEmail = () => {
    sendEmailRequest("/api/auth/resend_email", "POST", {}, true);
  };

  return (
    <>
      <MainNavbar />
      {isLoading && <Spinner />}

      {profileData && (
        <div>
          <h1>Profile</h1>

          <div className="prf-block">
            <h2>Public Information</h2>
            <p></p>
            <img className="prf-img" src={profileData.image_url} />
            <button>Edit</button>

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
                  <EmailConfirmIcon verified={profileData.email_verified}>
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
                name="username"
                title="Username"
                api="/edit_username"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                user={profileData.email}
                value={profileData.username}
              >
                <p>{profileData.username}</p>
              </ProfileField>
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
