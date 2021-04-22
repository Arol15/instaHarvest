import { useState, useEffect } from "react";
import { useRequest, useForm, useModal } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";

import { validation } from "../../form_validation/validation";

import "./uploadImage.css";

const UploadImage = ({ title, closeModal, uploadFileAPI, multipleImages }) => {
  const [method, setMethod] = useState(null);
  const [images, setImages] = useState();
  const [isLoading, data, error, , sendRequest] = useRequest();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: true,
  });

  const onSubmit = (e) => {
    e && e.preventDefault();
    const imagesData = new FormData();

    if (images.length > 4) {
      showModal("You can upload up to 4 images", "mdl-error");
      return;
    }
    for (let i = 0; i < images.length; i++) {
      if (images[i].size > 2097152) {
        showModal(
          `Image size should be less then 2 mb. Image ${i + 1} has size ${(
            images[i].size / 1048576
          ).toFixed(1)} mb`,
          "mdl-error"
        );
        return;
      }
      imagesData.append("file", images[i]);
    }

    sendRequest(uploadFileAPI, "POST", imagesData);
  };

  const handleInputFileChange = (event) => {
    event && event.preventDefault();
    setImages(event.target.files);
  };

  const resetMethod = () => {
    setMethod(null);
  };

  useEffect(() => {
    if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
      resetMethod();
    } else if (error) {
      showModal(error, "mdl-error");
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="upload-image">
      {isLoading && <Spinner />}
      {title && <h3>{title}</h3>}
      <button
        className="button-link"
        onClick={() => {
          setMethod("upload");
        }}
      >
        Upload photo
      </button>

      {method === "upload" && (
        <form encType="multipart/form-data">
          <input
            type="file"
            name="image_url"
            accept="image/*"
            onChange={handleInputFileChange}
            multiple={multipleImages}
          ></input>
          <button onClick={onSubmit}>Submit</button>
          <button onClick={resetMethod}>Cancel</button>
        </form>
      )}

      {data && (
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

export default UploadImage;
