import { useModal } from "../../hooks/hooks";
import { useSelector, shallowEqual } from "react-redux";

import ProfileUpdateImage from "./ProfileUpdateImage";
import { ButtonLink, FlexColumn } from "../styled/styled";

import { selectProfile } from "../../store/profileSlice";
import styled from "styled-components/macro";

const Header = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
`;

const ProfileBackImage = styled.img`
  position: absolute;
  left: 0;
  width: 100%;
  height: 152px;
  object-fit: cover;
`;

const BackEditLink = styled(ButtonLink)`
  position: absolute;
  right: 20px;
  bottom: 80px;
  border-radius: 10px;
  height: 30px;
  width: 50px;
  background-color: #0000005e;
  padding-left: 8px;
  padding-top: 4px;
  color: white;

  &:hover {
    background: #0000005e;
  }
`;

const ProfileImageContainer = styled(FlexColumn)`
  position: relative;
  align-items: center;
  padding-top: 58px;
  width: fit-content;
  margin: 0 auto;

  > div {
    position: absolute;
    outline: none;
    border: none;
    width: 152px;
    height: 76px;
    background-color: rgba(0, 0, 0, 0.37);
    transform: translateY(75%);
    clip-path: circle(76px at 50% -25%);
  }

  > img {
    height: 152px;
    width: 152px;
    border-radius: 50%;
  }
`;

const ModalContainer = styled.div`
  padding: 30px;
`;

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
        <Header>
          <ProfileBackImage
            src={profileBackImg ? profileBackImg : data.image_back_url}
            alt=""
          />
          {edit && (
            <BackEditLink
              onClick={() => {
                showModal(
                  <ModalContainer>
                    <ProfileUpdateImage
                      title="Set profile background image"
                      closeModal={closeModal}
                      uploadFileAPI="/api/account/edit_back_image"
                      deleteImage={{
                        title: "Delete profile background image",
                        deleteImageAPI: "/api/account/edit_back_image",
                      }}
                    />
                  </ModalContainer>
                );
              }}
            >
              Edit
            </BackEditLink>
          )}

          <ProfileImageContainer>
            <img src={profileImg ? profileImg : data.image_url} alt="" />
            {edit && <div></div>}
            {edit && (
              <ButtonLink
                css={`
                  fontsize: 1.1rem;
                  position: absolute;
                  color: white;
                  transform: translate(0, 45px);
                `}
                onClick={() => {
                  showModal(
                    <ModalContainer>
                      <ProfileUpdateImage
                        title="Set profile image"
                        closeModal={closeModal}
                        uploadFileAPI="/api/account/edit_profile_image"
                        deleteImage={{
                          title: "Delete profile image",
                          deleteImageAPI: "/api/account/edit_profile_image",
                        }}
                      />
                    </ModalContainer>
                  );
                }}
              >
                Edit
              </ButtonLink>
            )}
          </ProfileImageContainer>
        </Header>
      )}
    </>
  );
};

export default ProfileHeader;
