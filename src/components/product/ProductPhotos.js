import { useRef } from "react";
import { useSelector } from "react-redux";
import { useElementPosition } from "../../hooks/hooks";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { selectCurrentProduct } from "../../store/productsSlice";
import classnames from "classnames";
import "./product.css";

const ProductPhotos = ({ width = 340, height = 300 }) => {
  const {
    properties: { product_images },
  } = useSelector(selectCurrentProduct);

  const ref = useRef();

  const [
    hasElemOnLeft,
    hasElemOnRight,
    scrollLeft,
    scrollRight,
  ] = useElementPosition(ref);

  return (
    <div
      className="prd-photos-carousel-main background"
      style={{ width: width, height: height }}
    >
      <div
        className={classnames("prd-photos-arrow prd-photos-arrow-left", {
          "prd-photos-arrow-hidden": !hasElemOnLeft,
        })}
        onClick={scrollLeft}
      >
        <FiArrowLeft size="34px" style={{ padding: "auto 0" }} />
      </div>
      <div className="prd-photos-carousel-inner" ref={ref}>
        {product_images.map((image, ind) => {
          return (
            <img
              key={ind}
              src={image.image_url}
              alt=""
              style={{ width: width - 40 }}
            />
          );
        })}
      </div>
      <div
        className={classnames("prd-photos-arrow prd-photos-arrow-right", {
          "prd-photos-arrow-hidden": !hasElemOnRight,
        })}
        onClick={scrollRight}
      >
        <FiArrowRight size="34px" style={{ padding: "auto 0" }} />
      </div>
    </div>
  );
};

export default ProductPhotos;
