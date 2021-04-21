import { useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRequest, useModal } from "../../hooks/hooks";

import AuthModal from "../auth/AuthModal";
import Spinner from "../UI/Spinner";

import { checkAuth } from "../../utils/localStorage";

const ProductDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const user_id = location.state.user_id;
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [info, setInfo] = useState({});

  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const getChat = () => {
    sendRequest("/api/chat/find_create_chat", "POST", {
      recipient_id: location.state.user_id,
    });
  };

  const openChat = (data) => {
    history.push({
      pathname: `/chats/${info.first_name}`,
      state: data,
    });
  };

  useEffect(() => {
    sendRequest(`/api/products/product-location-info/${user_id}`, "POST");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data && data.chat_id) {
      openChat({
        recipient_id: location.state.user_id,
        recipient_name: info.first_name,
        recipient_img: info.image_url,
        chat_id: data.chat_id,
        user_id: data.user_id,
      });
    }
    if (data) {
      setInfo(data.product_details);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      <div>
        <div>Product: {location.state.name}</div>
        <p>About this product: {location.state.description}</p>
        <div>
          Location for map: {info.lat} and {info.lon}
        </div>
        {checkAuth() ? (
          <button
            onClick={() => {
              getChat();
            }}
          >
            Connect with seller
          </button>
        ) : (
          <button
            onClick={() => showModal(<AuthModal afterConfirm={closeModal} />)}
          >
            Connect with Seller
          </button>
        )}
      </div>
      {modal}
    </>
  );
};

export default ProductDetails;
