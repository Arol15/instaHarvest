import prfBack from "../../assets/images/prf-background.jpg";
import "./profile.css";

const ProfileHeader = ({ image, imageBack, edit }) => {
  return (
    <>
      <img className="prf-back-img" src={imageBack || prfBack} />
      <div className="prf-img-block">
        <img className="prf-img" src={image} />
        {edit && <div></div>}
        {edit && <a>Edit</a>}
      </div>
    </>
  );
};

export default ProfileHeader;
