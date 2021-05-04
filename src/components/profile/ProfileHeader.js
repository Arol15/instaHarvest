import { useModal } from "../../hooks/hooks";
import { useSelector, shallowEqual } from "react-redux";

import ProfileUpdateImage from "./ProfileUpdateImage";

import { selectProfile } from "../../store/profileSlice";
import "./profile.css";

const ProfileHeader = ({ edit, profileImg, profileBackImg }) => {
  const data = useSelector(selectProfile, shallowEqual);

  const { modal, showModal, closeModal } = useModal({
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
                        <ProfileUpdateImage
                          title="Set profile background image"
                          closeModal={closeModal}
                          uploadFileAPI="/api/account/edit_back_image"
                          deleteImage={{
                            title: "Delete profile background image",
                            deleteImageAPI: "/api/account/edit_back_image",
                          }}
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
          <div className="flexbox-column prf-img-block">
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
                      <ProfileUpdateImage
                        title="Set profile image"
                        closeModal={closeModal}
                        uploadFileAPI="/api/account/edit_profile_image"
                        deleteImage={{
                          title: "Delete profile image",
                          deleteImageAPI: "/api/account/edit_profile_image",
                        }}
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
