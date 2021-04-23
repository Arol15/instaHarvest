import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Tooltip from "../UI/Tooltip";

import { setCurrentProduct } from "../../store/productsSlice";
import classnames from "classnames";
import "./product.css";

const Product = ({ product, openMap, accentPersonal }) => {
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
      className={classnames("prd-element", {
        "prd-personal": product.properties.personal && accentPersonal,
      })}
    >
      <img
        className="prd-img"
        src={primaryImage}
        alt={product.properties.name}
      />
      <div className="prd-circle prd-circle-left">
        <Tooltip text={product.properties.user.first_name}>
          <img
            className="prd-user-icon"
            src={product.properties.user.image_url}
            alt={product.properties.user.first_name}
          />
        </Tooltip>
      </div>

      {product.geometry.properties.distance_km && (
        <div className="prd-circle prd-circle-right">
          <p>{product.geometry.properties.distance_km}</p>
          <p>km</p>
        </div>
      )}

      <div className="prd-description-back">
        <div className="prd-description">
          <p>
            <b>{product.properties.name}</b>
          </p>
          <p>
            {product.properties.price
              ? `$ ${product.properties.price}`
              : "Free"}
          </p>
          <p>
            <button
              onClick={() => {
                handleClick(product);
              }}
              className="button-link"
            >
              Details
            </button>{" "}
            {openMap && (
              <button
                onClick={() => {
                  dispatch(setCurrentProduct(product));
                  openMap();
                }}
                className="button-link"
              >
                Show on map
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
