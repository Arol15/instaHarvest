import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";
import ProfileHeader from "./ProfileHeader";
import PublicProfileInfo from "./PublicProfileInfo";
import Spinner from "../UI/Spinner";
import "./profile.css";

const PublicProfile = (props) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  useEffect(() => {
    sendRequest(`/api/account/${props.match.params.addr}`, "GET", {});
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {error && <h1>Profile Not Found</h1>}
      {data && (
        <>
          <ProfileHeader edit={false} />
          <PublicProfileInfo
            firstName={data.first_name}
            emailVerified={data.email_verified}
            city={data.city}
            usState={data.us_state}
            joined={data.joined}
          />
        </>
      )}
    </>
  );
};

export default PublicProfile;
