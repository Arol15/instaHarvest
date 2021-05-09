import { useEffect } from "react";
import { useRequest } from "../../hooks/hooks";

import ProfileHeader from "./ProfileHeader";
import PublicProfileInfo from "./PublicProfileInfo";
import Spinner from "../UI/Spinner";
import UserProducts from "../product/UserProducts";

import { datetimeToLocal } from "../../utils/utils";

const PublicProfile = (props) => {
  const { isLoading, data, error, sendRequest } = useRequest();

  useEffect(() => {
    sendRequest(`/api/account/${props.match.params.addr}`, "GET", {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      {error && <h1>Profile Not Found</h1>}
      {data && (
        <>
          <ProfileHeader
            edit={false}
            profileImg={data.image_url}
            profileBackImg={data.image_back_url}
          />
          <PublicProfileInfo
            firstName={data.first_name}
            emailVerified={data.email_verified}
            city={data.city}
            usState={data.us_state}
            country={data.country}
            joined={datetimeToLocal(data.created_at, "month-year")}
          />
          <UserProducts
            user_id={data.user_id}
            title={`All products from ${data.first_name}`}
          />
        </>
      )}
    </>
  );
};

export default PublicProfile;
