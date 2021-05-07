import { useFavorites } from "../../hooks/hooks";
import { useDispatch } from "react-redux";

import {
  FlexRow,
  FlexColumn,
  Button,
  CircleContainer,
  IconInsideCircleContainer,
} from "../styled/styled";

import { showMsg } from "../../store/modalSlice";
import "./product.css";
import styled from "styled-components";

const Container = styled(FlexColumn)`
  width: 190px;

  & img {
    width: 20px;
    height: 20px;
  }

  .full-text {
    width: max-content;
    font-size: 0.7rem;
    color: hsl(0, 0%, 74%);
  }
`;

const ProductFavorites = ({ product_id, authorized, full, position }) => {
  const { total, added, addToFavorites } = useFavorites(product_id);
  const dispatch = useDispatch();

  const onClick = () => {
    if (authorized) {
      addToFavorites();
    } else {
      dispatch(
        showMsg({
          open: true,
          msg: "Please authorize!",
          type: "error",
        })
      );
    }
  };
  const icon = added
    ? "https://instaharvest.net/assets/images/icons/heart.png"
    : "https://instaharvest.net/assets/images/icons/heart-outline.png";

  const totalExceptUser = added ? total - 1 : total;

  return (
    <>
      {full ? (
        <Container>
          <Button onClick={onClick}>
            <FlexRow>
              <img src={icon} alt="" />{" "}
              <div style={{ margin: "auto 0", marginLeft: "5px" }}>
                {added ? "Added to favorites" : "Add to favorites"}
              </div>
            </FlexRow>
          </Button>
          {totalExceptUser > 0 && (
            <div className="full-text">{`${totalExceptUser} user${
              totalExceptUser > 1 ? "s have" : " has"
            } already added to favorites`}</div>
          )}
        </Container>
      ) : (
        <CircleContainer cursor={authorized} position={position}>
          <IconInsideCircleContainer
            onClick={onClick}
            favorites={total > 0}
            src={icon}
            alt=""
          />
          {total > 0 && <p>{total}</p>}
        </CircleContainer>
      )}
    </>
  );
};

export default ProductFavorites;
