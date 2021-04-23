import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    location: null,
    products: null,
    currentProduct: null,
  },
  reducers: {
    updateProducts: (state, action) => {
      state.products = [...action.payload];
    },
    updateLocation: (state, action) => {
      state.location = { ...action.payload };
    },
    clearProductsState: (state) => {
      state.location = null;
      state.products = null;
    },
    setCurrentProduct: (state, action) => {
      const product = { ...action.payload };
      state.currentProduct = product;
      state.location = {
        lon: product.geometry.coordinates[0],
        lat: product.geometry.coordinates[1],
      };
    },
    clearProduct: (state) => {
      state.currentProduct = null;
    },
  },
});

export const {
  updateProducts,
  updateLocation,
  clearProductsState,
  setCurrentProduct,
  clearProduct,
} = productsSlice.actions;

export const selectProducts = (state) => ({
  location: state.products.location,
  products: state.products.products,
});

export const selectCurrentProduct = (state) => state.products.currentProduct;

export default productsSlice.reducer;
