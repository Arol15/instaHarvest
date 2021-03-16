import { useState, useEffect } from "react";
import prfBack from "../../assets/images/prf-background.jpg";
import { loadJSON, logout } from "../../utils/localStorage";
import { useHistory } from "react-router-dom";
import "./profile.css";

const ProfileHeader = ({ edit }) => {
  const [data] = useState(loadJSON("app_data"));
  const history = useHistory();
  useEffect(() => {
    if (!data) {
      logout();
      history.push("/login");
    }
  }, []);
  return (
    <>
      {data && (
        <>
          <img className="prf-back-img" src={data.image_back_url || prfBack} />
          <div className="prf-img-block">
            <img className="prf-img" src={data.image_url} />
            {edit && <div></div>}
            {edit && <a>Edit</a>}
          </div>
        </>
      )}
    </>
  );
};

export default ProfileHeader;
