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
  const [currTab, setcurrTab] = useState("products");

  useEffect(() => {
    if (!productsData.location) {
      history.push("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const changeTab = (tab) => {
  //   setcurrTab(tab);
  // }

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
                setcurrTab("products");
              },
            },
            {
              title: "Map",
              name: "map",
              onClick: () => {
                setcurrTab("map");
              },
            },
          ]}
        />

        {currTab === "products" && (
          <div className="prd-grid">
            {productsData.products.map((product) => {
              return (
                <div key={product.properties.product_id}>
                  <Product product={product} />
                </div>
              );
            })}
          </div>
        )}

        <div
          className={classnames({
            "prd-map-hide": currTab !== "map",
          })}
        >
          <Map />
        </div>
      </>
    )
  );
};

export default Products;
