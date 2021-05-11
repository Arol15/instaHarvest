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
import {
  Button,
  ButtonLink,
  ButtonCircleIcon,
  FlexRow,
  FlexColumn,
  ContainerWithBackground,
} from "../styled/styled";

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
import styled from "styled-components/macro";

const MainContainer = styled.div`
  margin: 0 40px;
  margin-top: 20px;
  text-align: center;

  @media (max-width: 699px) {
    margin-left: 10px;
    margin-right: 10px;
  }
`;

const Buttons = styled(FlexRow)`
  align-items: flex-start;
  margin: 0 auto;
  margin-top: 5px;

  button {
    height: 40px;
    margin: 0 10px;
    font-size: 0.9rem;
  }
`;

const SecondaryContainer = styled(FlexColumn)`
  margin: 0 40px;
  margin-top: 40px;
  padding: 20px;
  position: relative;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.secondaryBackgroundColor};
  width: 200px;
  height: 200px;
  text-align: center;
  cursor: pointer;
  transition: 0.25s;

  p {
    margin: 5px 0;
  }

  div {
    font-size: 0.8rem;
  }

  img {
    margin: 0 auto;
    height: 80px;
    width: 80px;
    border-radius: 50%;
  }
`;

const ProductDescription = styled(ContainerWithBackground)`
  padding: 20px;
  margin: 0 auto;
  max-width: 360px;
  text-align: start;
  word-wrap: normal;
  word-break: keep-all;
`;

const ProductDetailsAddress = styled.h3`
  max-width: 360px;
  margin: 0 20px;
  margin-top: 20px;
`;

const ProductDetails = () => {
  const history = useHistory();
  const product = useSelector(selectCurrentProduct);
  const dispatch = useDispatch();
  const { isLoading, data, error, sendRequest } = useRequest();
  const [editImages, setEditImages] = useState(false);

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
    if (!product) {
      history.push("/search-results");
    }
    if (history.location.state && history.location.state === "update") {
      updateProduct();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          type: "error",
        })
      );
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      {product && (
        <FlexRow>
          <MainContainer>
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
              <ButtonCircleIcon
                onClick={() => {
                  setEditImages(true);
                }}
                css="transform: translateY(-34px);"
              >
                <FiEdit size="26px" style={{ margin: "2px" }} />
              </ButtonCircleIcon>
            )}
            <Buttons>
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
            </Buttons>
            <h2> {product.properties.name}</h2>
            <ProductDescription>
              {product.properties.description}
            </ProductDescription>
            <ProductDetailsAddress>
              {addressObjToString(product.geometry.properties)}
            </ProductDetailsAddress>
            <Map width={360} />
          </MainContainer>
          {product.properties.personal ? (
            <SecondaryContainer>
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
              <ButtonLink
                onClick={() => {
                  history.push(
                    `/edit-product/${product.properties.product_id}`
                  );
                }}
              >
                Edit product
              </ButtonLink>
            </SecondaryContainer>
          ) : (
            <SecondaryContainer
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
            </SecondaryContainer>
          )}
        </FlexRow>
      )}
      {modal}
    </>
  );
};

export default ProductDetails;
