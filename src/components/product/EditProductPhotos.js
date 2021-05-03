import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRequest, useUploadImages, useModal } from "../../hooks/hooks";

import ConfirmationDelete from "../UI/ConfirmationDelete";
import Spinner from "../UI/Spinner";

import { createFormData } from "../../utils/utils";
import { selectCurrentProduct } from "../../store/productsSlice";
import { showMsg } from "../../store/modalSlice";

const EditProductPhotos = ({ closeEdit, updateProduct }) => {
  const { properties } = useSelector(selectCurrentProduct);
  const { product_images } = properties;
  const { isLoading, data, error, sendRequest } = useRequest();
  const [uploadImagesContainer, filesToSend] = useUploadImages({
    multipleImages: true,
  });
  const dispatch = useDispatch();
  const { modal, showModal, closeModal } = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const onDelete = (image_id) => {
    sendRequest(
      `/api/products/edit_product_images/${properties.product_id}`,
      "DELETE",
      { image_id: image_id }
    );
  };

  const onUpload = () => {
    if (filesToSend.length + product_images.length > 4) {
      dispatch(
        showMsg({
          open: true,
          msg: `Every product can have up to 4 images. You already have ${product_images.length} and want to upload ${filesToSend.length}`,
          classes: "mdl-error",
        })
      );
    } else {
      sendRequest(
        `/api/products/edit_product_images/${properties.product_id}`,
        "POST",
        createFormData(filesToSend)
      );
    }
  };

  useEffect(() => {
    if (data && data.msg) {
      closeModal();
      dispatch(
        showMsg({
          open: true,
          msg: data.msg,
          classes: "mdl-ok",
        })
      );
      updateProduct();
      if (data.msg.includes("been uploaded")) {
        closeEdit();
      }
    } else if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error]);

  return (
    <div className="prd-edit-images-main">
      {modal}
      {isLoading && <Spinner />}
      <button className="button-link" onClick={closeEdit}>
        Close edit
      </button>
      <div className="flexbox-row">
        {product_images.length > 0 ? (
          product_images.map((image) => {
            return (
              <div className="flexbox-column">
                <img key={image.id} src={image.image_url} alt="" />
                <button
                  className="button-link"
                  onClick={() => {
                    showModal(
                      <ConfirmationDelete
                        title="Are you sure you want to delete the image?"
                        onYes={() => {
                          onDelete(image.id);
                        }}
                        onNo={closeModal}
                      />
                    );
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <img src={properties.product_icon} alt="" />
        )}
      </div>
      {uploadImagesContainer}
      {filesToSend.length > 0 && <button onClick={onUpload}>Upload</button>}
    </div>
  );
};

export default EditProductPhotos;
