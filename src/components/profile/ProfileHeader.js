import { useState, useEffect } from "react";
import prfBack from "../../assets/images/prf-background.jpg";
import { useHistory } from "react-router-dom";
import { useModal } from "../../hooks/hooks";
import UploadImage from "../UI/UploadImage";
import { shallowEqual, useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import "./profile.css";

const ProfileHeader = ({ edit, profileImg, profileBackImg }) => {
  const data = useSelector(selectProfile, shallowEqual);
  const history = useHistory();

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
              src={
                !data.image_back_url && !profileBackImg
                  ? prfBack
                  : profileBackImg
                  ? profileBackImg
                  : data.image_back_url
              }
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
            <img
              className="prf-img"
              src={profileImg ? profileImg : data.image_url}
            />
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
