import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import { useSelector, useDispatch } from "react-redux";

import AuthModal from "../auth/AuthModal";
import Spinner from "../UI/Spinner";
import ProductPhotos from "./ProductPhotos";
import ProductFavorites from "./ProductFavorites";
import PublicProfileInfo from "../profile/PublicProfileInfo";
import Map from "../map/Map";
import EditProductPhotos from "./EditProductPhotos";
import ConfirmationDelete from "../UI/ConfirmationDelete";
import { Button, ButtonLink } from "../styled/buttons";

import { FiEdit } from "react-icons/fi";
import { showMsg } from "../../store/modalSlice";
import {
  selectCurrentProduct,
  setCurrentProduct,
} from "../../store/productsSlice";
import {
  addressObjToString,
  datetimeToLocal,
  checkAuth,
} from "../../utils/utils";

const ProductDetails = () => {
  const history = useHistory();
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch();
  const { isLoading, data, error, sendRequest } = useRequest();
  const [editImages, setEditImages] = useState(false);

  useEffect(() => {
    if (!product) {
      history.push("/search-results");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { modal, showModal, closeModal } = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const getChat = () => {
    sendRequest("/api/chat/find_create_chat", "POST", {
      recipient_id: product.properties.user.user_id,
    });
  };

  const openChat = (data) => {
    history.push({
      pathname: `/chats/${product.properties.user.first_name}`,
      state: data,
    });
  };

  const onDelete = (product_id) => {
    sendRequest("/api/products/delete_product", "DELETE", {
      product_id: product_id,
    });
  };

  const updateProduct = () => {
    sendRequest("/api/products/get_product", "POST", {
      product_id: product.properties.product_id,
    });
  };

  useEffect(() => {
    if (data) {
      if (data.chat_id) {
        openChat({
          recipient_id: product.properties.user.user_id,
          recipient_name: product.properties.user.first_name,
          recipient_img: product.properties.user.image_url,
          chat_id: data.chat_id,
          user_id: data.user_id,
        });
      } else if (data.product) {
        dispatch(setCurrentProduct(data.product));
      } else if (data.msg && data.msg === "Deleted") {
        if (history.location.state.prevPath === "/profile") {
          history.goBack();
        } else {
          history.push("/");
        }
      }
    }
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      {product && (
        <div className="flexbox-row prd-details-flexbox">
          <div className="prd-details-main">
            {editImages ? (
              <EditProductPhotos
                updateProduct={updateProduct}
                closeEdit={() => {
                  setEditImages(false);
                }}
                primaryImage={product.properties.primary_image}
              />
            ) : (
              <ProductPhotos
                width={400}
                height={300}
                icon={product.properties.product_icon}
                personal={product.properties.personal}
              />
            )}
            {product.properties.personal && !editImages && (
              <div
                className="prd-details-photos-edit-button"
                onClick={() => {
                  setEditImages(true);
                }}
              >
                <FiEdit size="26px" style={{ margin: "2px" }} />
              </div>
            )}
            <div className="flexbox-row prd-details-buttons">
              <ProductFavorites
                product_id={product.properties.product_id}
                authorized={product.properties.authorized}
                full
              />
              {!product.properties.personal ? (
                <Button
                  onClick={() => {
                    if (checkAuth()) {
                      getChat();
                    } else {
                      showModal(
                        <AuthModal
                          afterConfirm={() => {
                            updateProduct();
                            closeModal();
                          }}
                        />
                      );
                    }
                  }}
                >
                  Connect with the seller
                </Button>
              ) : null}
            </div>
            <h2> {product.properties.name}</h2>
            <p className="prd-details-description background">
              {product.properties.description}
            </p>
            <h3 className="prd-details-address">
              {addressObjToString(product.geometry.properties)}
            </h3>
            <Map width={360} />
          </div>
          {product.properties.personal ? (
            <div className="flexbox-column prd-details-profile background">
              <p>Created: {datetimeToLocal(product.properties.created_at)} </p>
              {product.properties.updated_at && (
                <p>Updated: {datetimeToLocal(product.properties.updated_at)}</p>
              )}
              <ButtonLink
                onClick={() => {
                  showModal(
                    <ConfirmationDelete
                      title="Are you sure to delete?"
                      onYes={() => {
                        onDelete(product.properties.product_id);
                      }}
                      onNo={closeModal}
                    />
                  );
                }}
              >
                Delete product
              </ButtonLink>
            </div>
          ) : (
            <div
              className="flexbox-column prd-details-profile background"
              onClick={() =>
                history.push(`/profile/${product.properties.user.profile_addr}`)
              }
            >
              <img src={product.properties.user.image_url} alt="" />
              <PublicProfileInfo
                firstName={product.properties.user.first_name}
                emailVerified={product.properties.user.email_verified}
                city={product.properties.user.city}
                usState={product.properties.user.us_state}
                country={product.properties.user.country}
                joined={datetimeToLocal(
                  product.properties.user.created_at,
                  "month-year"
                )}
              />
            </div>
          )}
        </div>
      )}
      {modal}
    </>
  );
};

export default ProductDetails;
