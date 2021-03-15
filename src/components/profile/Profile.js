import { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { useRequest, useWidth } from "../../hooks/hooks";
import Spinner from "../UI/Spinner";
import ProfileField from "./ProfileField";
import ProfileHeader from "./ProfileHeader";
import EmailConfirmIcon from "../UI/EmailConfirmIcon";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import ProfileMenu from "./ProfileMenu";
import ProfileTab from "./ProfileTab";
import PublicProfileInfo from "./PublicProfileInfo";

import config from "../../config";
import "./profile.css";

const Profile = (props) => {
  const [profileData, setProfileData] = useState(null);
  const [currTab, setCurrTab] = useState("public");
  const [editProfile, setEditProfile] = useState(false);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const isDesktop = useWidth();
  const [
    ,
    dataEmailReq,
    errorEmailReq,
    errorNumEmailReq,
    sendEmailRequest,
  ] = useRequest();

  const [, setMsgState] = useContext(ModalMsgContext);

  const history = useHistory();

  const updateProfileData = () => {
    sendRequest("/api/account/get_profile_private", "POST", {}, true);
  };

  useEffect(() => {
    updateProfileData();
  }, []);

  useEffect(() => {
    if (data) {
      setProfileData({ ...data });
      if (data.msg) {
        setMsgState({
          open: true,
          msg: data.msg,
          classes: "mdl-ok",
        });
      }
    }
    if (error) {
      setMsgState({
        open: true,
        msg: error,
        classes: "mdl-error",
      });
    }
  }, [data, error, errorNum]);

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
        classes: "mdl-ok",
      });
    }
  }, [dataEmailReq, errorEmailReq, errorNumEmailReq]);

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
      {isLoading && <Spinner />}

      {profileData && (
        <>
          <ProfileHeader
            image={profileData.image_url}
            imageBack={profileData.image_back_url}
            edit={true}
          />
          {editProfile ? (
            <div className="profile-edit">
              <ProfileMenu isDesktop={isDesktop} setCurrTab={setCurrTab} />
              {}
            </div>
          ) : (
            <PublicProfileInfo
              firstName={data.first_name}
              emailVerified={data.email_verified}
              city={data.city}
              state={data.state}
              joined={data.joined}
            />
          )}

          <div className="prf-block">
            <div className="prf-block-col">
              <div className="">
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
                      <a onClick={resendConfirmEmail}>
                        Resend confirmation email
                      </a>
                    </div>
                  )}
                  <hr />
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
                  <hr />
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
                  <hr />
                </div>
              </div>
            </div>

            <div className="prf-block-col">
              <div className="">
                <h2>Public Information</h2>
                <p></p>

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
                  <hr />
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
                      <Link to={`/profile/${profileData.profile_addr}`}>
                        {config.baseUrl}
                        {profileData.profile_addr}
                      </Link>
                    </p>
                  </ProfileField>
                  <hr />
                </div>
              </div>
            </div>
          </div>
          <div className="prf-block">
            <div className="prf-block-col">
              <h2>Address</h2>
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
                <hr />
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
                <hr />
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
                <hr />
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
                <hr />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
