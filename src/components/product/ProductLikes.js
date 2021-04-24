import { useState, useEffect } from "react";
import { useRequest } from "../../hooks/hooks";

import classnames from "classnames";
import "./product.css";

const ProductLikes = ({ product_id, authorized, addClass }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [isLoading, data, error, , sendRequest] = useRequest();

  useEffect(() => {
    sendRequest(`/api/products/get_likes/${product_id}`, "POST");
  }, []);

  useEffect(() => {
    if (data) {
      setLiked(data.liked);
      setLikes(data.likes);
    }
  }, [data]);

  const onClick = () => {
    if (authorized) sendRequest(`/api/products/like/${product_id}`, "POST");
  };

  return (
    <div
      className={classnames("prd-likes-circle", addClass, {
        "prd-unauth": !authorized,
      })}
    >
      <img
        onClick={onClick}
        className={classnames("prd-heart-icon", {
          "prd-liked": likes > 0,
        })}
        src={
          liked
            ? "https://instaharvest.net/assets/images/icons/heart.png"
            : "https://instaharvest.net/assets/images/icons/heart-outline.png"
        }
        alt=""
      />
      {likes > 0 && <p>{likes}</p>}
    </div>
  );
};

export default ProductLikes;
