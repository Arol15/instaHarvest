import EmailConfirmIcon from "../UI/EmailConfirmIcon";

import statesList from "../../assets/data/states.json";
import _styled from "styled-components/macro";

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
    <div
      css={`
        margin-top: 20px;
        text-align: center;
      `}
    >
      <EmailConfirmIcon verified={emailVerified}>
        <span
          css={`
            font-size: 24px;
            font-weight: bold;
          `}
        >
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
