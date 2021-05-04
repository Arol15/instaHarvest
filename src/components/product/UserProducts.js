import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";

import Spinner from "../UI/Spinner";
import Product from "./Product";

import { showMsg } from "../../store/modalSlice";
import { updateProducts, selectProducts } from "../../store/productsSlice";
import "./product.css";
import { addressObjToString } from "../../utils/utils";

const UserProducts = ({ user_id, title }) => {
  const [showProducts, setShowProducts] = useState(false);
  const userProducts = useSelector(selectProducts);
  const { isLoading, data, error, sendRequest } = useRequest();
  const dispatch = useDispatch();

  const getProducts = () => {
    sendRequest(
      "/api/products/products_per_user",
      "POST",
      user_id ? { user_id: user_id } : {}
    );
  };

  useEffect(() => {
    getProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      dispatch(updateProducts(data.user_products));
      setShowProducts(true);
    }
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="prd">
      <h2>{title}</h2>
      {isLoading && <Spinner />}
      {showProducts && (
        <div className="flexbox-row prd-grid">
          {userProducts.products.map((product) => {
            return (
              <div
                className="prd-user-products-container"
                key={product.properties.product_id}
              >
                <div className="prd-user-products-title">
                  <p>
                    <b>{product.properties.name}</b>
                  </p>
                  <p>{addressObjToString(product.geometry.properties)}</p>
                </div>
                <Product product={product} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserProducts;
