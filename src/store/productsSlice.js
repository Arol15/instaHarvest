import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    lat: null,
    lgt: null,
    products: null,
  },
  reducers: {},
});

export const {} = productsSlice.actions;

export const selectProducts = (state) => ({
  lgt: state.products.lgt,
  lat: state.products.lat,
  products: state.products.products,
});

export default productsSlice.reducer;
