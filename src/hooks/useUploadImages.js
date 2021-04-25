import { useState, useEffect, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

import { FiX } from "react-icons/fi";

import "./useUploadImages.css";

/**
 *  useUploadImages
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useUploadImages
 *
 * ```
 * const [uploadImagesContainer, filesToSend] = useUploadImages({ multipleImages });
 * ```
 */

const useUploadImages = ({ multipleImages }) => {
  const [files, setFiles] = useState([]);
  const [filesToSend, setFilesToSend] = useState([]);

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
    cursor: "pointer",
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

  const fileSizeValidator = (file) => {
    if (file.size > 2097152) {
      return {
        code: "size-too-large",
        message: `Image size should be less then 2 mb. This image has size ${(
          file.size / 1048576
        ).toFixed(1)} mb`,
      };
    }
  };

  const removeFile = (name) => {
    let tmpFiles = [...filesToSend];

    tmpFiles.splice(
      tmpFiles.findIndex((file) => file.name === name),
      1
    );
    setFilesToSend(tmpFiles);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFilesToSend(acceptedFiles);
  }, []);

  const {
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

  const previewImages = useMemo(() => {
    return filesToSend.map((file) => {
      return (
        <div className="upload-images-thumb" key={file.name}>
          <div className="upload-images-thumb-inner">
            <div
              className="upload-images-x-icon"
              onClick={() => {
                removeFile(file.name);
              }}
            >
              <FiX
                size="20px"
                style={{
                  color: "white",
                  borderRadius: "50%",
                  backgroundColor: "#1c1c1c79",
                }}
              />
            </div>
            <img src={file.preview} />
          </div>
        </div>
      );
    });
  }, [files]);

  const fileRejectionItems = useMemo(() => {
    return fileRejections.map(({ file, errors }) => {
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
  }, [fileRejections]);

  const uploadImagesContainer = useMemo(() => {
    return (
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
                Drag and drop {multipleImages ? "images" : "the image"} here, or
                click to select {multipleImages ? "images" : "the image"}
              </p>
              <em>
                (Maximum {multipleImages ? "4" : "1"} image
                {multipleImages && "s"}. Only *.jpeg, *.png, *.bmp, *.gif images
                will be accepted)
              </em>
            </>
          )}
        </div>
        <aside>
          {previewImages.length > 0 && <h4>Accepted files</h4>}
          <div className="upload-images-thumbs-container">{previewImages}</div>
          {fileRejectionItems.length > 0 && <h4>Rejected files</h4>}
          <ul>{fileRejectionItems}</ul>
        </aside>
      </>
    );
  }, [
    isDragActive,
    isDragReject,
    isDragAccept,
    previewImages,
    fileRejectionItems,
  ]);

  useEffect(() => {
    setFiles(
      filesToSend.map((file) => {
        if (file && !file.preview) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        }
      })
    );
  }, [filesToSend]);

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

  return [uploadImagesContainer, filesToSend];
};

export default useUploadImages;
