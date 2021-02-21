import { useEffect } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import Spinner from "../../components/UI/Spinner";

import { Icon, InlineIcon } from "@iconify/react";
import baselineVerified from "@iconify-icons/ic/baseline-verified";
import outlineVerified from "@iconify-icons/ic/outline-verified";
import statesList from "../../data/states.json";

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
          <div>
            <h2 className="inline-block">{data.first_name}</h2>
            <span className="tooltip">
              <InlineIcon
                icon={data.email_verified ? baselineVerified : outlineVerified}
                width="30"
                height="30"
                color={data.email_verified && "#4E9340"}
              />
              <span className="tooltiptext">
                {data.email_verified ? "Email verified" : "Email not verified"}
              </span>
            </span>
          </div>
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
