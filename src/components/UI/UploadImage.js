import { useState, useEffect } from "react";
import { useRequest, useForm, useModal } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";

import { validation } from "../../form_validation/validation";

import "./uploadImage.css";

const UploadImage = ({
  title,
  closeModal,
  uploadFileAPI,
  imageUrlAPI,
  multipleImages,
}) => {
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
    if (method === "upload") {
      if (images.length > 4) {
        showModal("You can upload up to 4 images", "mdl-error");
        return;
      }
      for (let i = 0; i < images.length; i++) {
        if (images[i].size > 1000000) {
          showModal(
            `Image size should be less then 1mb. Image ${i + 1} has size ${(
              images[i].size / 1048576
            ).toFixed(1)} mb`,
            "mdl-error"
          );
          return;
        }
      }
      const imagesData = new FormData();
      imagesData.append("file", images);
      sendRequest(uploadFileAPI, "POST", imagesData);
    }
  };

  // const deleteImage = () => {
  //   sendRequest(deleteImageAPI, "POST", {});
  // };
  const uploadImageUrl = () => {
    sendRequest(imageUrlAPI, "POST", formData);
  };

  const handleInputFileChange = (event) => {
    event && event.preventDefault();
    setImages(event.target.files);
  };

  const [, handleSubmit, handleInputChange, formData, formErrors] = useForm(
    { url: "" },
    uploadImageUrl,
    validation
  );

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
          setMethod("url");
        }}
      >
        Save image url
      </button>
      <button
        className="button-link"
        onClick={() => {
          setMethod("upload");
        }}
      >
        Upload photo
      </button>
      {/* <button
        className="button-link"
        onClick={() => {
          setMethod("delete");
        }}
      >
        Delete photo
      </button> */}

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

      {method === "url" && (
        <form>
          <input
            placeholder={"Enter image url"}
            type="text"
            name={"url"}
            onChange={handleInputChange}
            value={formData.url || ""}
          ></input>
          <div className="form-danger">{formErrors.url && formErrors.url}</div>

          <button onClick={handleSubmit}>Submit</button>
          <button onClick={resetMethod}>Cancel</button>
        </form>
      )}

      {/* {method === "delete" && (
        <div>
          <p>Delete image? Are you sure?</p>
          <button onClick={resetMethod}>No</button>
          <button
            onClick={() => {
              setMethod("delete-confirmed");
              deleteImage();
            }}
          >
            Yes
          </button>
        </div>
      )}

      {method === "delete-confirmed" && <p>Image is deleting...</p>} */}

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
