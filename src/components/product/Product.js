import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Tooltip from "../UI/Tooltip";
import ProductLikes from "./ProductLikes";

import { setCurrentProduct } from "../../store/productsSlice";
import classnames from "classnames";
import "./product.css";

const Product = ({ product, openMap, accentPersonal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const [like, toggleLike] = useState();

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
        onClick={() => {
          handleClick(product);
        }}
        src={primaryImage}
        alt={product.properties.name}
      />
      <div className="prd-circle prd-circle-top-left">
        <Tooltip text={product.properties.user.first_name}>
          <img
            className="prd-user-icon"
            src={product.properties.user.image_url}
            alt={product.properties.user.first_name}
          />
        </Tooltip>
      </div>
      {product.geometry.properties.distance_mi !== null && (
        <div className="prd-circle prd-circle-top-right">
          <p>{product.geometry.properties.distance_mi}</p>
          <p>mi</p>
        </div>
      )}

      <ProductLikes
        product_id={product.properties.product_id}
        authorized={product.properties.authorized}
        addClass="prd-circle-bottom-left"
      />

      {openMap && (
        <div
          onClick={() => {
            dispatch(setCurrentProduct(product));
            openMap();
          }}
          className="prd-circle prd-circle-bottom-right"
        >
          <Tooltip text="Show on map">
            <img
              className="prd-map-icon"
              src="https://instaharvest.net/assets/images/icons/map.png"
              alt="map"
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default Product;
