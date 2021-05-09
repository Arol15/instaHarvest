import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Product from "./Product";
import Map from "../map/Map";
import TabsMenu from "../UI/TabsMenu";
import { ProductsGrid } from "../styled/styled";

import { selectProducts } from "../../store/productsSlice";
import styled from "styled-components/macro";

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

        <ProductsGrid hide={currTab !== "products"}>
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
        </ProductsGrid>

        <div style={currTab !== "map" ? { display: "none" } : {}}>
          <Map />
        </div>
      </>
    )
  );
};

export default Products;
