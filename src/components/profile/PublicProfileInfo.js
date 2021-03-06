import EmailConfirmIcon from "../UI/EmailConfirmIcon";

import statesList from "../../assets/data/states.json";
import "./profile.css";

const PublicProfileInfo = ({
  firstName,
  emailVerified,
  city,
  country,
  usState,
  joined,
}) => {
  let location;
  if (usState) {
    location = `${
      statesList.find((elem) => elem.name === usState).abbreviation
    }, USA`;
  } else {
    location = country;
  }

  return (
    <div className="prf-pbl-top">
      <EmailConfirmIcon verified={emailVerified}>
        <span style={{ fontSize: "24px", fontWeight: "bold" }}>
          {firstName}
        </span>
      </EmailConfirmIcon>

      <p>
        {city}, {location}
      </p>
      <p>Joined: {joined}</p>
    </div>
  );
};

export default PublicProfileInfo;
