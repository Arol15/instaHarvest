import { useFavorites } from "../../hooks/hooks";

import classnames from "classnames";
import "./product.css";

const ProductFavorites = ({ product_id, authorized, addClass }) => {
  const { total, added, addToFavorites } = useFavorites(product_id);

  const onClick = () => {
    if (authorized) {
      addToFavorites();
    }
  };

  return (
    <div
      className={classnames("prd-favorite-circle", addClass, {
        "prd-unauth": !authorized,
      })}
    >
      <img
        onClick={onClick}
        className={classnames("prd-heart-icon", {
          "prd-favorite": total > 0,
        })}
        src={
          added
            ? "https://instaharvest.net/assets/images/icons/heart.png"
            : "https://instaharvest.net/assets/images/icons/heart-outline.png"
        }
        alt=""
      />
      {total > 0 && <p>{total}</p>}
    </div>
  );
};

export default ProductFavorites;
