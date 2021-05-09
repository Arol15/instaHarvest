import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useRequest } from "../../hooks/hooks";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import ProfileField from "./ProfileField";
import ProfileHeader from "./ProfileHeader";
import EmailConfirmIcon from "../UI/EmailConfirmIcon";
import ProfileSideMenu from "./ProfileSideMenu";
import Spinner from "../UI/Spinner";
import Addresses from "./Addresses";
import {
  Button,
  ButtonLink,
  FlexRow,
  StyledProfileField,
} from "../styled/styled";

import { showMsg } from "../../store/modalSlice";
import { updateProfile, selectProfile } from "../../store/profileSlice";
import config from "../../config";
import styled from "styled-components/macro";

const EditProfileContainer = styled(FlexRow)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const Column = styled.div`
  margin: 0 20px;
`;

const Section = styled.section`
  width: 60vw;
  margin: 0 auto;
  padding: 5px 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.secondaryBackgroundColor};
  border-radius: 15px;

  @media (max-width: 440px) {
    margin-left: 40px;
  }
`;

const EditProfile = ({ tab }) => {
  const profileData = useSelector(selectProfile, shallowEqual);
  const dispatch = useDispatch();
  const [currTab, setCurrTab] = useState(tab);
  const { isLoading, data, error, errorNum, sendRequest } = useRequest();
  const rq2 = useRequest();
  const history = useHistory();
  const updateProfileData = () => {
    sendRequest("/api/account/get_profile_private", "POST", {});
  };

  useEffect(() => {
    if (!profileData.email) {
      updateProfileData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCurrTab(tab);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data && data.msg) {
      dispatch(showMsg({ open: true, msg: data.msg, type: "ok" }));
    } else if (data) {
      dispatch(updateProfile({ ...data }));
    }
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    }
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rq2.error) {
      dispatch(
        showMsg({
          open: true,
          msg: rq2.error,
          type: "error",
        })
      );
    } else if (rq2.data && rq2.data.msg) {
      dispatch(
        showMsg({
          open: true,
          msg: rq2.data.msg,
          type: "ok",
        })
      );
    }
  }, [rq2.data, rq2.error, rq2.errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = (msg, type) => {
    dispatch(
      showMsg({
        open: true,
        msg: msg,
        type: type,
      })
    );
  };

  const resendConfirmEmail = () => {
    rq2.sendRequest("/api/auth/resend_email", "POST", {}, true);
  };

  return (
    <>
      {isLoading && <Spinner />}
      <ProfileHeader edit={true} />
      <Button
        css={`
          width: fit-content;
          margin: 0 auto;
          margin-bottom: 20px;
        `}
        onClick={() => {
          history.push("/profile");
        }}
      >
        Return to profile
      </Button>

      {profileData && (
        <EditProfileContainer>
          <ProfileSideMenu currTab={currTab} />
          <Column />
          {!currTab && (
            <Section>
              <h2>Public Information</h2>

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
            </Section>
          )}

          {currTab === "private" && (
            <Section>
              <h2>Private information</h2>
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
                  <span>{profileData.email}</span>
                  <EmailConfirmIcon verified={profileData.email_verified} />
                </div>
                {!profileData.email_verified && (
                  <div>
                    <ButtonLink onClick={resendConfirmEmail}>
                      Resend confirmation email
                    </ButtonLink>
                  </div>
                )}
              </ProfileField>

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

              <ProfileField
                name="password"
                user={profileData.email}
                title="Change password"
                api="/change_pass"
                method="PATCH"
                update={updateProfileData}
                sendMsg={sendMessage}
                value={profileData.password}
              >
                <p>{profileData.password}</p>
              </ProfileField>
            </Section>
          )}

          {currTab === "address" && (
            <Section>
              <h2>Addresses</h2>

              <StyledProfileField>
                <Addresses />
              </StyledProfileField>
            </Section>
          )}
          <Column />
        </EditProfileContainer>
      )}
    </>
  );
};

export default EditProfile;
