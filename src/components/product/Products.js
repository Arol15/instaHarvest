import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Product from "./Product";
import Map from "../map/Map";

import { selectProducts } from "../../store/productsSlice";
import "./product.css";

const Products = () => {
  const history = useHistory();
  const productsData = useSelector(selectProducts);

  useEffect(() => {
    if (!productsData.location) {
      history.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    productsData.products && (
      <>
        <div className="prd-grid">
          {productsData.products.map((product) => {
            return (
              <div key={product.properties.product_id}>
                <Product product={product} />
              </div>
            );
          })}
        </div>
        <div>
          <Map />
        </div>
      </>
    )
  );
};

export default Products;
