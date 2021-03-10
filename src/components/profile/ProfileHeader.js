import prfBack from "../../assets/images/prf-background.jpg";
import "./profile.css";

const ProfileHeader = ({ imageBack, edit }) => {
  return (
    <div className="prf-block-top">
      <img className="prf-back-img" src={imageBack || prfBack} />
    </div>
  );
};

export default ProfileHeader;
