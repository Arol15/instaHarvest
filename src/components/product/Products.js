import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Product from "./Product";
import Map from "../map/Map";
import TabsMenu from "../UI/TabsMenu";

import classnames from "classnames";
import { selectProducts } from "../../store/productsSlice";
import "./product.css";

const Products = () => {
  const history = useHistory();
  const productsData = useSelector(selectProducts);
  const [currTab, setCurrTab] = useState("products");

  const onBackButtonEvent = () => {
    setCurrTab("products");
  };

  useEffect(() => {
    if (!productsData.location) {
      history.push("/");
    }
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currTab === "map") {
      window.history.pushState(null, null, window.location.href);
    }
  }, [currTab]);

  return (
    productsData.products && (
      <>
        <TabsMenu
          currTab={currTab}
          tabs={[
            {
              title: "Products",
              name: "products",
              onClick: () => {
                setCurrTab("products");
              },
            },
            {
              title: "Map",
              name: "map",
              onClick: () => {
                setCurrTab("map");
              },
            },
          ]}
        />

        <div
          className={classnames("flexbox-row prd-grid", {
            "prd-hide-tab": currTab !== "products",
          })}
        >
          {productsData.products.map((product) => {
            return (
              <div key={product.properties.product_id}>
                <Product
                  product={product}
                  openMap={() => {
                    setCurrTab("map");
                  }}
                  accentPersonal
                />
              </div>
            );
          })}
        </div>

        <div
          className={classnames({
            "prd-hide-tab": currTab !== "map",
          })}
        >
          <Map />
        </div>
      </>
    )
  );
};

export default Products;
