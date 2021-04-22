import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setCurrentProduct } from "../../store/productsSlice";
import classnames from "classnames";
import "./product.css";

const Product = ({ product }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = (prod) => {
    dispatch(setCurrentProduct(prod));
    history.push({
      pathname: "/product-info",
      state: { prevPath: history.location.pathname },
    });
  };

  const primaryImage = useMemo(() => {
    const images = product.properties.product_images;
    let primaryImage = images.find((image) => image.primary === true);
    if (!primaryImage) {
      primaryImage = product.properties.product_icon;
    }
    return primaryImage;
  }, [product]);

  return (
    <div
      onClick={() => {
        handleClick(product);
      }}
      className={classnames("prd-element", {
        "prd-personal": product.properties.personal,
      })}
    >
      <img
        className="prd-img"
        src={primaryImage}
        alt={product.properties.name}
      />
      <div className="prd-description">
        <p>
          <b>{product.properties.name}</b>
        </p>
        <p>${product.properties.price}</p>
        {product.geometry.properties.distance_km && (
          <p>{product.geometry.properties.distance_km} km away</p>
        )}
      </div>
    </div>
  );
};

export default Product;
