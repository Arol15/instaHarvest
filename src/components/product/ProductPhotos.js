import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useElementPosition, useWidth } from "../../hooks/hooks";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { selectCurrentProduct } from "../../store/productsSlice";
import classnames from "classnames";
import "./product.css";

const ProductPhotos = ({ width = 340, height = 300, icon }) => {
  const {
    properties: { product_images },
  } = useSelector(selectCurrentProduct);

  const ref = useRef();
  const [currWidth, setCurrWidth] = useState(width);

  const { screenWidth } = useWidth();

  const {
    hasElemOnLeft,
    hasElemOnRight,
    scrollLeft,
    scrollRight,
  } = useElementPosition(ref);

  useEffect(() => {
    if (width > screenWidth) {
      setCurrWidth(screenWidth);
    } else {
      setCurrWidth(width);
    }
  }, [screenWidth]);

  return (
    <div
      className="prd-photos-carousel-main background"
      style={{ width: currWidth, height: height }}
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
        {product_images.length > 0 ? (
          product_images.map((image) => {
            return (
              <img
                key={image.id}
                src={image.image_url}
                alt=""
                style={{ width: currWidth - 40 }}
              />
            );
          })
        ) : (
          <img src={icon} style={{ width: currWidth - 40 }} />
        )}
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
