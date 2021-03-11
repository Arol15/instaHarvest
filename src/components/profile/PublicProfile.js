import { useEffect, useContext } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import Spinner from "../UI/Spinner";
import statesList from "../../assets/data/states.json";
import EmailConfirmIcon from "../UI/EmailConfirmIcon";
import ProfileHeader from "./ProfileHeader";
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
          <ProfileHeader
            image={data.image_url}
            imageBack={data.image_back_url}
            edit={false}
          />
          <div className="prf-pbl-top">
            <EmailConfirmIcon verified={data.email_verified}>
              <h2 className="inline-block">{data.first_name}</h2>
            </EmailConfirmIcon>

            <p>
              {data.city},{" "}
              {statesList.find((elem) => elem.name === data.state).abbreviation}
            </p>
            <p>Joined: {data.joined}</p>
          </div>
        </>
      )}
    </>
  );
};

export default PublicProfile;
