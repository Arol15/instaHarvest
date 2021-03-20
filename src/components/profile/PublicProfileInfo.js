import EmailConfirmIcon from "../UI/EmailConfirmIcon";
import statesList from "../../assets/data/states.json";
import "./profile.css";

const PublicProfileInfo = ({
  firstName,
  emailVerified,
  city,
  usState,
  joined,
}) => {
  return (
    <div className="prf-pbl-top">
      <EmailConfirmIcon verified={emailVerified}>
        <h2 className="inline-block">{firstName}</h2>
      </EmailConfirmIcon>

      <p>
        {city}, {statesList.find((elem) => elem.name === usState).abbreviation}
      </p>
      <p>Joined: {joined}</p>
    </div>
  );
};

export default PublicProfileInfo;
