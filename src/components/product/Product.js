import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Tooltip from "../UI/Tooltip";
import ProductFavorites from "./ProductFavorites";
import { CircleContainer, IconInsideCircleContainer } from "../styled/styled";

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

  return (
    <div
      className={classnames("prd-element border", {
        "prd-personal": product.properties.personal && accentPersonal,
      })}
    >
      <img
        className="prd-img"
        onClick={() => {
          handleClick(product);
        }}
        src={
          product.properties.primary_image
            ? product.properties.primary_image
            : product.properties.product_icon
        }
        alt={product.properties.name}
      />
      <CircleContainer
        cursor
        position="top-left"
        onClick={() => {
          history.push(`/profile/${product.properties.user.profile_addr}`);
        }}
      >
        <Tooltip text={product.properties.user.first_name}>
          <img
            style={{
              marginTop: "10%",
              height: "80%",
              width: "80%",
              borderRadius: "50%",
            }}
            src={product.properties.user.image_url}
            alt={product.properties.user.first_name}
          />
        </Tooltip>
      </CircleContainer>
      {product.geometry.properties.distance_mi !== null && (
        <CircleContainer position="top-right">
          <p>{product.geometry.properties.distance_mi}</p>
          <p>mi</p>
        </CircleContainer>
      )}

      <ProductFavorites
        product_id={product.properties.product_id}
        authorized={product.properties.authorized}
        position="bottom-left"
      />

      {openMap && (
        <CircleContainer
          cursor
          onClick={() => {
            dispatch(setCurrentProduct(product));
            openMap();
          }}
          position="bottom-right"
        >
          <Tooltip text="Show on map">
            <IconInsideCircleContainer
              src="https://instaharvest.net/assets/images/icons/map.png"
              alt="map"
            />
          </Tooltip>
        </CircleContainer>
      )}
    </div>
  );
};

export default Product;
