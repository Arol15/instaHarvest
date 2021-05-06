import { useFavorites } from "../../hooks/hooks";
import { useDispatch } from "react-redux";

import { FlexRow } from "../styled/flexbox";
import { Button } from "../styled/buttons";

import { showMsg } from "../../store/modalSlice";
import classnames from "classnames";
import "./product.css";

const ProductFavorites = ({ product_id, authorized, addClass, full }) => {
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
        <div className="flexbox-column prd-favorite-full">
          <Button onClick={onClick}>
            <FlexRow>
              <img src={icon} alt="" />{" "}
              <div style={{ margin: "auto 0", marginLeft: "5px" }}>
                {added ? "Added to favorites" : "Add to favorites"}
              </div>
            </FlexRow>
          </Button>
          {totalExceptUser > 0 && (
            <div className="prd-favorite-full-text-bottom">{`${totalExceptUser} user${
              totalExceptUser > 1 ? "s have" : " has"
            } already added to favorites`}</div>
          )}
        </div>
      ) : (
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
            src={icon}
            alt=""
          />
          {total > 0 && <p>{total}</p>}
        </div>
      )}
    </>
  );
};

export default ProductFavorites;
