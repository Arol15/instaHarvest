import { useState, useEffect } from "react";
import useRequest from "../hooks/useRequest";
import Spinner from "../components/UI/Spinner";
import useModal from "../hooks/useModal";
// import { v4 as uuid } from "uuid";

const Profile = (props) => {
  const [profileData, setProfileData] = useState({
    image_url: "https://img.icons8.com/doodle/148/000000/test-account.png",
  });
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: false,
  });

  useEffect(() => {
    sendRequest("api/account/get_profile_private", "POST", {}, true);
  }, []);
  useEffect(() => {
    setProfileData({ ...data });
  }, [data]);

  useEffect(() => {
    if (error) {
      showModal(error, "mdl-error");
    } else if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
    }
  }, [error, errorNum, data]);

  const { image_url, username, email, ...rest } = profileData;
  console.log(modal);
  return (
    <>
      {isLoading && <Spinner />}

      {modal}

      <h1>Profile</h1>

      {!isLoading && data && (
        <div>
          <div className="prf-public">
            {/* <ProfileField title="Display name" /> */}
          </div>
          <div className="prf-private">
            {/* <ProfileField title="First Name" />,
          <ProfileField title="Last Name" />,
          <ProfileField title="email" />, */}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
