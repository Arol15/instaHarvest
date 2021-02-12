import { useState, useEffect } from "react";
import useRequest from "../hooks/useRequest";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  useEffect(() => {
    sendRequest("api/account/get_profile", "POST", {}, true);
  }, []);
  useEffect(() => {
    setProfileData({ ...data });
  }, [data]);

  console.log("error:" + error);
  return (
    <div>
      <h1>Profile</h1>
      <p>email: {profileData.email} </p>
    </div>
  );
};

export default Profile;
