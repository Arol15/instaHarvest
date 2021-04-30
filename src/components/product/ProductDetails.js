import { useHistory } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useRequest, useModal } from "../../hooks/hooks";
import { useSelector, useDispatch } from "react-redux";

import AuthModal from "../auth/AuthModal";
import Spinner from "../UI/Spinner";
import ProductPhotos from "./ProductPhotos";
import ProductFavorites from "./ProductFavorites";
import PublicProfileInfo from "../profile/PublicProfileInfo";

import { showMsg } from "../../store/modalSlice";
import {
  selectCurrentProduct,
  setCurrentProduct,
} from "../../store/productsSlice";
import { datetimeToLocal } from "../../utils/datetime";
import { checkAuth } from "../../utils/localStorage";

const ProductDetails = () => {
  const history = useHistory();
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch();
  const { isLoading, data, error, sendRequest } = useRequest();

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

  const confirmDelete = useMemo(() => {
    return (
      <>
        <h3>Are you sure to delete?</h3>
        <button
          onClick={() => {
            onDelete(product.properties.product_id);
          }}
        >
          Yes
        </button>
        <button onClick={closeModal}>No</button>
      </>
    );
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {product && (
        <div className="flexbox-row prd-details-flexbox">
          <div className="prd-details-main">
            <ProductPhotos
              width={400}
              height={300}
              icon={product.properties.product_icon}
            />
            <ProductFavorites
              product_id={product.properties.product_id}
              authorized={product.properties.authorized}
              full
            />

            <div>Product: {product.properties.name}</div>
            <p>About this product: {product.properties.description}</p>
            {product.properties.personal ? (
              <button
                onClick={() => {
                  showModal(confirmDelete);
                }}
              >
                Delete product
              </button>
            ) : (
              <button
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
              </button>
            )}
          </div>
          <div
            className="prd-details-profile background"
            onClick={() =>
              history.push(`/profile/${product.properties.user.profile_addr}`)
            }
          >
            <img src={product.properties.user.image_url} />
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
        </div>
      )}
      {modal}
    </>
  );
};

export default ProductDetails;
