import { useEffect } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import Spinner from "../../components/UI/Spinner";
import statesList from "../../data/states.json";
import EmailConfirmIcon from "../../components/UI/EmailConfirmIcon";

const PublicProfile = (props) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    timeOut: 7000,
    inPlace: false,
  });
  useEffect(() => {
    sendRequest(`/api/account/${props.match.params.addr}`, "GET", {});
  }, []);

  console.log();
  return (
    <>
      {isLoading && <Spinner />}

      {modal}
      <h1></h1>
      {error && <h1>Profile Not Found</h1>}
      {data && (
        <div className="">
          <img src={data.image_url} />
          <EmailConfirmIcon email_verified={data.email_verified}>
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
