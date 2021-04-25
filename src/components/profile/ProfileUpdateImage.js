import { useState, useEffect } from "react";
import { useRequest, useModal, useUploadImages } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";
import DeleteImage from "../UI/DeleteImage";

import { createFormData } from "../../utils/images";
import "./profile.css";

const ProfileUpdateImage = ({
  title,
  closeModal,
  uploadFileAPI,
  multipleImages,
  deleteImage,
}) => {
  const [method, setMethod] = useState(null);
  const [isLoading, data, error, , sendRequest] = useRequest();
  const [modal, showModal] = useModal({
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
      showModal(data.msg, "mdl-ok");
      setMethod("close");
    } else if (error) {
      showModal(error, "mdl-error");
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="prf-upload-image">
      {isLoading && <Spinner />}
      {title && <h3>{title}</h3>}
      {method === "upload" ? (
        <h4>Upload images</h4>
      ) : (
        <button
          className="button-link"
          onClick={() => {
            setMethod("upload");
          }}
        >
          Upload images
        </button>
      )}

      {method === "upload" && (
        <>
          {uploadImagesContainer}
          <div className="prf-upload-image-buttons">
            <button onClick={onSubmit}>Submit</button>
            <button onClick={resetMethod}>Cancel</button>
          </div>
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

      {method == "close" && (
        <button
          onClick={() => {
            closeModal();
            window.location.reload();
          }}
        >
          Close
        </button>
      )}

      {modal}
    </div>
  );
};

export default ProfileUpdateImage;
