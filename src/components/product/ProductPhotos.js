import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useElementPosition, useScreen } from "../../hooks/hooks";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { selectCurrentProduct } from "../../store/productsSlice";
import styled from "styled-components";

const CarouselArrow = styled.div`
  visibility: visible;
  background-color: hsla(0, 0%, 0%, 0.562);
  color: white;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  position: absolute;
  cursor: pointer;
  top: 50%;
  transition: all 0.25s ease-in-out;
  opacity: 0;
  transition-delay: 0.5s;
  ${(props) => (props.position === "left" ? "left: 0;" : "right: 0;")};
  visibility: ${(props) => (props.hasNoElement ? "hidden" : "visible")};

  &:hover {
    background-color: hsla(0, 0%, 0%, 0.719);
  }
`;

const PhotoCarousel = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 10px 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;

  &:hover ${CarouselArrow} {
    opacity: 1;
    transition-delay: 0s;
  }
`;

const CarouselInner = styled.div`
  display: flex;
  width: inherit;
  height: inherit;
  flex-direction: row;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    scroll-snap-align: center;
  }

  img {
    display: flex;
    margin: 0 auto;
    object-fit: contain;
    align-items: center;
    justify-content: center;
  }

  img:not(:first-child):not(:last-child) {
    padding: 0 5px;
  }

  img:first-child {
    padding-left: 20px;
  }

  img:last-child {
    padding-right: 20px;
  }
`;

const ProductPhotos = ({ width = 340, height = 300, icon, personal }) => {
  const {
    properties: { product_images },
  } = useSelector(selectCurrentProduct);

  const ref = useRef();
  const [currWidth, setCurrWidth] = useState(width);

  const { screenWidth } = useScreen();

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
  }, [screenWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PhotoCarousel width={currWidth} height={height}>
      <CarouselArrow
        position="left"
        hasNoElement={!hasElemOnLeft}
        onClick={scrollLeft}
      >
        <FiArrowLeft size="34px" />
      </CarouselArrow>
      <CarouselInner ref={ref}>
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
          <img src={icon} style={{ width: currWidth - 40 }} alt="" />
        )}
      </CarouselInner>
      <CarouselArrow
        position="right"
        hasNoElement={!hasElemOnRight}
        onClick={scrollRight}
      >
        <FiArrowRight size="34px" />
      </CarouselArrow>
    </PhotoCarousel>
  );
};

export default ProductPhotos;
