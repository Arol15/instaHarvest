import { useModal } from "../../hooks/hooks";
import { useSelector, shallowEqual } from "react-redux";

import ProfileUpdateImage from "./ProfileUpdateImage";
import { ButtonLink } from "../styled/styled";

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
                <ButtonLink
                  style={{
                    position: "absolute",
                    paddingLeft: "10px",
                    paddingTop: "4px",
                    color: "white",
                  }}
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
                </ButtonLink>
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
              <ButtonLink
                style={{
                  fontSize: "1.1rem",
                  position: "absolute",
                  color: "white",
                  transform: "translate(0, 45px)",
                }}
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
              </ButtonLink>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
