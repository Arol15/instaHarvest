import { useState, useEffect } from "react";
import useRequest from "../hooks/useRequest";
import Spinner from "./UI/Spinner";
import Error from "./UI/MsgModal";

const Profile = (props) => {
  const [profileData, setProfileData] = useState({});
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  useEffect(() => {
    sendRequest("api/account/get_profile", "POST", {}, true);
  }, []);
  useEffect(() => {
    setProfileData({ ...data });
  }, [data]);

  let profile = <Spinner inPlace={false} />;

  if (errorNum === 401 || errorNum === 403) {
    profile = <h1>{error}</h1>;
  } else if (error) {
    profile = <h1>{error}. Cannot load profile</h1>;
  }

  if (!error && !isLoading && data) {
    profile = (
      <div>
        <h1>Profile</h1>
        <p>email: {profileData.email} </p>
      </div>
    );
  }

  console.log("error:" + error);
  return <h1>Profile</h1>;
};

export default Profile;
