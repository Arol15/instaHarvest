import { useState, useEffect } from "react";
import prfBack from "../../assets/images/prf-background.jpg";
import { loadJSON, logout } from "../../utils/localStorage";
import { useHistory } from "react-router-dom";
import { useModal } from "../../hooks/hooks";
import UploadImage from "../UI/UploadImage";
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

  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  return (
    <>
      {modal}
      {data && (
        <div className="prf-header">
          <div className="prf-back-block">
            <img
              className="prf-back-img"
              src={data.image_back_url || prfBack}
            />
            {edit && (
              <div>
                <a
                  onClick={() => {
                    showModal(
                      <UploadImage
                        title="Set profile background image"
                        closeModal={closeModal}
                        uploadFileAPI="/api/account/update_back_image_file"
                        imageUrlAPI="/api/account/update_back_image_url"
                        deleteImageAPI="/api/account/delete_back_image"
                      />
                    );
                  }}
                >
                  Edit
                </a>
              </div>
            )}
          </div>
          <div className="prf-img-block">
            <img className="prf-img" src={data.image_url} />
            {edit && <div></div>}
            {edit && (
              <a
                onClick={() => {
                  showModal(
                    <UploadImage
                      title="Set profile image"
                      closeModal={closeModal}
                      uploadFileAPI="/api/account/update_profile_image_file"
                      imageUrlAPI="/api/account/update_profile_image_url"
                      deleteImageAPI="/api/account/delete_profile_image"
                    />
                  );
                }}
              >
                Edit
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
