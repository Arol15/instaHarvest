import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

import Product from "./Product";
import Map from "../map/Map";

const Products = () => {
  const location = useLocation();
  const history = useHistory();
  const [state, setState] = useState(
    location.state ? { ...location.state } : null
  );

  useEffect(() => {
    if (!state) {
      history.push("/");
    }
  }, []);

  return (
    <>
      <div>
        {state.products.map((product) => {
          return (
            <div key={product.product_id}>
              <Product product={product} />
            </div>
          );
        })}
      </div>

      <div>
        <Map location={state.location} points={state.products} />
      </div>
    </>
  );
};

export default Products;
