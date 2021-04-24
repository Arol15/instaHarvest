import { useState, useEffect, useCallback, useMemo } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import { useDropzone } from "react-dropzone";

import Spinner from "../UI/Spinner";
import DeleteImage from "../UI/DeleteImage";

import "./uploadImage.css";

const UploadImage = ({
  title,
  closeModal,
  uploadFileAPI,
  multipleImages,
  deleteImage,
}) => {
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const activeStyle = {
    borderColor: "#c1bebe",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const [method, setMethod] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, data, error, , sendRequest] = useRequest();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: true,
  });
  const [imagesToSend, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setImages(acceptedFiles);
  }, []);

  const fileSizeValidator = (file) => {
    if (file.size > 2097152) {
      return {
        code: "szie-too-large",
        message: `Image size should be less then 2 mb. This image has size ${(
          file.size / 1048576
        ).toFixed(1)} mb`,
      };
    }
  };

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    validator: fileSizeValidator,
    accept: "image/jpeg, image/png, image/bmp, image/gif",
    maxFiles: multipleImages ? 4 : 1,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const removeFile = (name) => {
    let tmpFiles = [...imagesToSend];

    tmpFiles.splice(
      tmpFiles.findIndex((file) => file.name === name),
      1
    );
    setImages(tmpFiles);
  };

  const thumbs = useMemo(() => {
    return imagesToSend.map((file) => {
      return (
        <div className="upload-image-thumb" key={file.name}>
          <div className="upload-image-thumb-inner">
            <div
              onClick={() => {
                removeFile(file.name);
              }}
            >
              x
            </div>
            <img src={file.preview} />
          </div>
        </div>
      );
    });
  }, [files]);

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.name}>
        <b>{file.name}</b>:
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  const onSubmit = (e) => {
    if (imagesToSend.length > 0) {
      sendRequest(uploadFileAPI, "POST", imagesToSend);
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
      resetMethod();
    } else if (error) {
      showModal(error, "mdl-error");
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setFiles(
      imagesToSend.map((file) => {
        if (file && !file.preview) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        }
      })
    );
  }, [imagesToSend]);

  useEffect(
    () => () => {
      files.forEach((file) => {
        if (file) {
          URL.revokeObjectURL(file.preview);
        }
      });
    },
    [files]
  );
  // console.log(imagesToSend);

  return (
    <div className="upload-image">
      {isLoading && <Spinner />}
      {title && <h3>{title}</h3>}
      {method === "upload" ? (
        <h4>Upload photo</h4>
      ) : (
        <button
          className="button-link"
          onClick={() => {
            setMethod("upload");
          }}
        >
          Upload photo
        </button>
      )}

      {method === "upload" && (
        <>
          <div {...getRootProps({ style })}>
            <input {...getInputProps({ multiple: multipleImages })} />
            {isDragActive ? (
              isDragReject ? (
                <em style={{ color: "red" }}>Something wrong</em>
              ) : (
                <p>Drop the {multipleImages ? "files" : "file"} here ...</p>
              )
            ) : (
              <>
                <p>
                  Drag and drop {multipleImages ? "images" : "the image"} here,
                  or click to select {multipleImages ? "images" : "the image"}
                </p>
                <em>
                  (Maximum {multipleImages ? "4" : "1"} image
                  {multipleImages && "s"}. Only *.jpeg, *.png, *.bmp, *.gif
                  images will be accepted)
                </em>
              </>
            )}
          </div>
          <aside>
            {thumbs.length > 0 && <h4>Accepted files</h4>}
            <div className="upload-image-thumbs-container">{thumbs}</div>
            {fileRejectionItems.length > 0 && <h4>Rejected files</h4>}
            <ul>{fileRejectionItems}</ul>
          </aside>

          <div className="upload-image-buttons">
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
