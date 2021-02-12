import { useState, useEffect } from "react";
import useFetch from "../hooks/fetch";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [isLoading, data, error, sendRequest] = useFetch();

  useEffect(() => {
    sendRequest("api/account/get_profile", "POST", {}, "ACCESS");
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
