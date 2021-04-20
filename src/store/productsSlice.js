import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    location: null,
    products: null,
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
  },
});

export const {
  updateProducts,
  updateLocation,
  clearProductsState,
} = productsSlice.actions;

export const selectProducts = (state) => ({
  location: state.products.location,
  products: state.products.products,
});

export default productsSlice.reducer;
