import { useState, useEffect } from "react";
import { useRequest, useModal } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";

const DeleteImage = ({ title, deleteImageAPI, currTab, setCurrTab }) => {
  const { modal, showModal } = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: true,
  });

  const { isLoading, data, error, sendRequest } = useRequest();

  const [deleteImage, setDeleteImage] = useState(false);

  const deleteImageRequest = (deleteImageAPI) => {
    sendRequest(deleteImageAPI, "DELETE", {});
  };

  useEffect(() => {
    if (currTab === "delete") {
      setDeleteImage(true);
    } else {
      setDeleteImage(false);
    }
  }, [currTab]);

  useEffect(() => {
    if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
      setCurrTab("close");
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
          setCurrTab("delete");
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
