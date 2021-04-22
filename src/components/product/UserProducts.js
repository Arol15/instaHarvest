import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";
import { useDispatch } from "react-redux";

import Spinner from "../UI/Spinner";
import Product from "./Product";

import { showMsg } from "../../store/modalSlice";
import "./product.css";

const UserProducts = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const dispatch = useDispatch();

  const getProducts = () => {
    sendRequest("/api/products/products_per_user", "POST", null);
  };

  useEffect(() => {
    getProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      setUserProducts(data.user_products);
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
    <div>
      <h2>All your products are here! </h2>
      {isLoading && <Spinner />}
      {userProducts && (
        <div className="prd-grid">
          {userProducts.map((product) => {
            return (
              <div key={product.properties.product_id}>
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
