import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";

import Spinner from "../UI/Spinner";
import Product from "./Product";

const UserProducts = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  const getProducts = () => {
    sendRequest("/api/products/products_per_user", "POST", null);
  };

  useEffect(() => {
    getProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data && data.msg === "deleted") {
      getProducts();
    } else if (data) {
      setUserProducts(data.user_products);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = (product_id) => {
    sendRequest("/api/products/delete_product", "delete", {
      product_id: product_id,
    });
  };

  return (
    <div>
      <h2>All your products are here! </h2>
      {isLoading && <Spinner />}
      {userProducts &&
        userProducts.map((product) => {
          return (
            <div key={product.properties.product_id}>
              <Product product={product} onDelete={handleDelete} />
            </div>
          );
        })}
    </div>
  );
};

export default UserProducts;
