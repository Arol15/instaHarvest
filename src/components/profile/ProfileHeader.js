import { useModal } from "../../hooks/hooks";
import { useSelector, shallowEqual } from "react-redux";

import UploadImage from "../UI/UploadImage";
import DeleteImage from "../UI/DeleteImage";

import { selectProfile } from "../../store/profileSlice";
import "./profile.css";

const ProfileHeader = ({ edit, profileImg, profileBackImg }) => {
  const data = useSelector(selectProfile, shallowEqual);

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
              src={profileBackImg ? profileBackImg : data.image_back_url}
              alt=""
            />
            {edit && (
              <div>
                <button
                  className="button-link"
                  onClick={() => {
                    showModal(
                      <div className="prf-edit-modal">
                        <UploadImage
                          title="Set profile background image"
                          closeModal={closeModal}
                          uploadFileAPI="/api/account/update_back_image_file"
                          imageUrlAPI="/api/account/update_back_image_url"
                        />
                        <DeleteImage
                          title="Delete profile background image"
                          deleteImageAPI="/api/account/delete_back_image"
                        />
                      </div>
                    );
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div className="prf-img-block">
            <img
              className="prf-img"
              src={profileImg ? profileImg : data.image_url}
              alt=""
            />
            {edit && <div></div>}
            {edit && (
              <button
                className="button-link"
                onClick={() => {
                  showModal(
                    <div className="prf-edit-modal">
                      <UploadImage
                        title="Set profile image"
                        closeModal={closeModal}
                        uploadFileAPI="/api/account/update_profile_image_file"
                        imageUrlAPI="/api/account/update_profile_image_url"
                        multipleImages={true}
                      />
                      <DeleteImage
                        title="Delete profile image"
                        deleteImageAPI="/api/account/delete_profile_image"
                      />
                    </div>
                  );
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
