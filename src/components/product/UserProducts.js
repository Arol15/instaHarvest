import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";

import Spinner from "../UI/Spinner";
import Product from "./Product";
import { ProductsGrid } from "../styled/styled";

import { showMsg } from "../../store/modalSlice";
import { updateProducts, selectProducts } from "../../store/productsSlice";
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
          type: "error",
        })
      );
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{title}</h2>
      {isLoading && <Spinner />}
      {showProducts && (
        <ProductsGrid>
          {userProducts.products.map((product) => {
            return (
              <div key={product.properties.product_id}>
                <div
                  style={{
                    width: "200px",
                    margin: "0 auto",
                  }}
                >
                  <p>
                    <b>{product.properties.name}</b>
                  </p>
                  <p>{addressObjToString(product.geometry.properties)}</p>
                </div>
                <Product product={product} />
              </div>
            );
          })}
        </ProductsGrid>
      )}
    </div>
  );
};

export default UserProducts;
