import { useEffect, useContext } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import Spinner from "../UI/Spinner";
import statesList from "../../data/states.json";
import EmailConfirmIcon from "../UI/EmailConfirmIcon";
import "./profile.css";

const PublicProfile = (props) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  useEffect(() => {
    sendRequest(`/api/account/${props.match.params.addr}`, "GET", {});
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      <h1></h1>
      {error && <h1>Profile Not Found</h1>}
      {data && (
        <div className="">
          <img className="prf-img" src={data.image_url} />
          <EmailConfirmIcon verified={data.email_verified}>
            <h2 className="inline-block">{data.first_name}</h2>
          </EmailConfirmIcon>
          <p>
            {data.city},{" "}
            {statesList.find((elem) => elem.name === data.state).abbreviation}
          </p>
          <p>Joined: {data.joined}</p>
        </div>
      )}
    </>
  );
};

export default PublicProfile;
