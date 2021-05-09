import { useState, useEffect } from "react";
import { useRequest, useModal, useUploadImages } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";
import DeleteImage from "../UI/DeleteImage";
import { Button, ButtonLink, FlexColumn } from "../styled/styled";

import { createFormData } from "../../utils/utils";
import styled from "styled-components/macro";

const Buttons = styled.div`
  button {
    margin: 10px;
    min-width: 40px;
    width: 100px;
  }
`;

const ProfileUpdateImage = ({
  title,
  closeModal,
  uploadFileAPI,
  multipleImages,
  deleteImage,
}) => {
  const [method, setMethod] = useState(null);
  const { isLoading, data, error, sendRequest } = useRequest();
  const { modal, showModal } = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: true,
  });

  const [uploadImagesContainer, filesToSend] = useUploadImages({
    multipleImages,
  });

  const onSubmit = (e) => {
    if (filesToSend.length > 0) {
      const formData = createFormData(filesToSend);
      sendRequest(uploadFileAPI, "POST", formData);
    } else {
      showModal("Add images", "mdl-error");
    }
  };

  const resetMethod = () => {
    setMethod(null);
  };

  useEffect(() => {
    if (data && data.msg) {
      showModal(data.msg, "ok");
      setMethod("close");
    } else if (error) {
      showModal(error, "error");
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FlexColumn>
      {isLoading && <Spinner />}
      {title && <h3>{title}</h3>}
      {method === "upload" ? (
        <h4>Upload images</h4>
      ) : (
        <ButtonLink
          onClick={() => {
            setMethod("upload");
          }}
        >
          Upload images
        </ButtonLink>
      )}

      {method === "upload" && (
        <>
          {uploadImagesContainer}
          <Buttons>
            <Button onClick={onSubmit}>Submit</Button>
            <Button onClick={resetMethod}>Cancel</Button>
          </Buttons>
        </>
      )}

      {deleteImage && (
        <DeleteImage
          title={deleteImage.title}
          deleteImageAPI={deleteImage.deleteImageAPI}
          currTab={method}
          setCurrTab={setMethod}
        />
      )}

      {method === "close" && (
        <Button
          onClick={() => {
            closeModal();
            window.location.reload();
          }}
        >
          Close
        </Button>
      )}

      {modal}
    </FlexColumn>
  );
};

export default ProfileUpdateImage;
