import { useState, useEffect } from "react";
import { useRequest, useModal } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";

const DeleteImage = ({ title, deleteImageAPI }) => {
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: true,
  });

  const [isLoading, data, error, , sendRequest] = useRequest();

  const [deleteImage, setDeleteImage] = useState(false);

  const deleteImageRequest = (deleteImageAPI) => {
    sendRequest(deleteImageAPI, "POST", {});
  };

  useEffect(() => {
    if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
    } else if (error) {
      showModal(error, "mdl-error");
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      <button
        className="button-link"
        onClick={() => {
          console.log("BUTTON");
          setDeleteImage(true);
        }}
      >
        {title}
      </button>
      {deleteImage && (
        <div>
          <p>Delete image? Are you sure?</p>
          <button
            onClick={() => {
              setDeleteImage(false);
            }}
          >
            No
          </button>
          <button
            onClick={() => {
              setDeleteImage(false);
              deleteImageRequest(deleteImageAPI);
            }}
          >
            Yes
          </button>
        </div>
      )}
      {modal}
    </>
  );
};

export default DeleteImage;
