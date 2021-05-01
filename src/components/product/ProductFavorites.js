import { useFavorites } from "../../hooks/hooks";
import { useDispatch } from "react-redux";

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
          classes: "mdl-error",
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
        <div className="prd-favorite-full">
          <button onClick={onClick}>
            <img src={icon} alt="" />{" "}
            <div className="inline-block prd-favorite-full-button-text">
              {added ? "Added to favorites" : "Add to favorites"}
            </div>
          </button>
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
