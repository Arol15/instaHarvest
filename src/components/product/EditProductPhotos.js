import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRequest, useUploadImages, useModal } from "../../hooks/hooks";

import ConfirmationDelete from "../UI/ConfirmationDelete";
import Spinner from "../UI/Spinner";
import { ButtonLink, Button, FlexRow } from "../styled/styled";
import { FlexColumn } from "../styled/styled";

import { createFormData } from "../../utils/utils";
import { selectCurrentProduct } from "../../store/productsSlice";
import { showMsg } from "../../store/modalSlice";
import styled from "styled-components";

const MainContainer = styled.div`
  padding-bottom: 40px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    padding: 5px;
  }
`;

const ProductImage = styled(FlexColumn)`
  p,
  button {
    font-size: 0.9rem;
    padding-bottom: 4px;
    padding-top: 0;
    margin-bottom: 0;
    margin-top: 0;
  }
`;

const EditProductPhotos = ({ closeEdit, updateProduct, primaryImage }) => {
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
          type: "error",
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

  const onMakePrimary = (product_id, image_url) => {
    sendRequest("/api/products/set_product_primary_image", "PATCH", {
      product_id: product_id,
      image_url: image_url,
    });
  };

  useEffect(() => {
    if (data && data.msg) {
      closeModal();
      dispatch(
        showMsg({
          open: true,
          msg: data.msg,
          type: "ok",
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
          type: "error",
        })
      );
    }
  }, [data, error]);

  return (
    <MainContainer>
      {modal}
      {isLoading && <Spinner />}
      <ButtonLink onClick={closeEdit}>Close edit</ButtonLink>
      <FlexRow>
        {product_images.length > 0 ? (
          product_images.map((image) => {
            return (
              <ProductImage key={image.id}>
                <img src={image.image_url} alt="" />
                <ButtonLink
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
                </ButtonLink>
                {product_images.length > 1 ? (
                  image.image_url === primaryImage ? (
                    <p>Primary Image</p>
                  ) : (
                    <ButtonLink
                      onClick={() => {
                        onMakePrimary(properties.product_id, image.image_url);
                      }}
                    >
                      Make primary
                    </ButtonLink>
                  )
                ) : null}
              </ProductImage>
            );
          })
        ) : (
          <img src={properties.product_icon} alt="" />
        )}
      </FlexRow>
      {uploadImagesContainer}
      {filesToSend.length > 0 && <Button onClick={onUpload}>Upload</Button>}
    </MainContainer>
  );
};

export default EditProductPhotos;
