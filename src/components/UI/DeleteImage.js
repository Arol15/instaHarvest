import { useState, useEffect } from "react";
import { useRequest, useModal } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";
import ConfirmationDelete from "../UI/ConfirmationDelete";
import { ButtonLink, FlexRow } from "../styled/styled";

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
      showModal(data.msg, "ok");
      setCurrTab("close");
    } else if (error) {
      showModal(error, "error");
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      <ButtonLink
        onClick={() => {
          setCurrTab("delete");
          setDeleteImage(true);
        }}
      >
        {title}
      </ButtonLink>
      {deleteImage && (
        <>
          <h3>Delete image? Are you sure?</h3>
          <FlexRow>
            <ConfirmationDelete
              onYes={() => {
                setDeleteImage(false);
                deleteImageRequest(deleteImageAPI);
              }}
              onNo={() => {
                setDeleteImage(false);
              }}
            />
          </FlexRow>
        </>
      )}
      {modal}
    </>
  );
};

export default DeleteImage;
