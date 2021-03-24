import { useState, useEffect } from "react";
import { useRequest, useForm, useModal } from "../../hooks/hooks";
import validation from "../../form_validation/validation";
import Spinner from "../UI/Spinner";
import "./uploadImage.css";

const UploadImage = ({
  title,
  closeModal,
  uploadFileAPI,
  imageUrlAPI,
  deleteImageAPI,
}) => {
  const [method, setMethod] = useState(null);
  const [image, setImage] = useState();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: true,
  });

  const onSubmit = (e) => {
    e && e.preventDefault();
    if (method === "upload") {
      if (image.size > 1000000) {
        showModal("Image size should be less then 1mb", "mdl-error");
      } else {
        const imageData = new FormData();
        imageData.append("file", image);
        sendRequest(uploadFileAPI, "POST", imageData);
      }
    }
  };

  const deleteImage = () => {
    sendRequest(deleteImageAPI, "POST", {});
  };
  const uploadImageUrl = () => {
    sendRequest(imageUrlAPI, "POST", formData);
  };

  const handleInputFileChange = (event) => {
    event && event.preventDefault();
    setImage(event.target.files[0]);
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
    if (data && data.message) {
      showModal(data.message, "mdl-ok");
      resetMethod();
    } else if (error) {
      showModal(error, "mdl-error");
    }
  }, [data, error]);

  return (
    <div className="upload-image">
      {isLoading && <Spinner />}
      {title && <h3>{title}</h3>}
      <a
        onClick={() => {
          setMethod("url");
        }}
      >
        Save image url
      </a>
      <a
        onClick={() => {
          setMethod("upload");
        }}
      >
        Upload photo
      </a>
      <a
        onClick={() => {
          setMethod("delete");
        }}
      >
        Delete photo
      </a>

      {method === "upload" && (
        <form encType="multipart/form-data">
          <input
            type="file"
            name="image_url"
            accept="image/*"
            onChange={handleInputFileChange}
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

      {method === "delete" && (
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

      {method === "delete-confirmed" && <p>Image is deleting...</p>}

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
