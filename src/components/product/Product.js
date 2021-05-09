import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Tooltip from "../UI/Tooltip";
import ProductFavorites from "./ProductFavorites";
import {
  CircleContainer,
  IconInsideCircleContainer,
  ContainerWithBorder,
} from "../styled/styled";

import { setCurrentProduct } from "../../store/productsSlice";
import styled from "styled-components/macro";

const ProductElement = styled(ContainerWithBorder)`
  position: relative;
  width: 200px;
  height: 200px;
  padding: 10px;
  margin: 7px;
  border-radius: 5px;
  transition: 0.5s;
  ${(props) =>
    props.personal
      ? `box-shadow: 0 0 3pt 3pt ${props.theme.elementSecondaryColor};`
      : null}

  &:hover {
    background-color: ${({ theme }) => theme.elementHoverColor};
    box-shadow: 0 0 6pt 3pt ${({ theme }) => theme.elementHoverColor};
  }
`;

const ProductImage = styled.img`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

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
    <ProductElement personal={product.properties.personal && accentPersonal}>
      <ProductImage
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
        showCursor
        position="top-left"
        onClick={() => {
          history.push(`/profile/${product.properties.user.profile_addr}`);
        }}
      >
        <Tooltip text={product.properties.user.first_name}>
          <img
            css={`
              margin-top: 10%;
              height: 80%;
              width: 80%;
              border-radius: 50%;
            `}
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
          showCursor
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
    </ProductElement>
  );
};

export default Product;
