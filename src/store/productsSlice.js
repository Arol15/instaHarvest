import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    lat: null,
    lon: null,
    products: null,
  },
  reducers: {},
});

export const {} = productsSlice.actions;

export const selectProducts = (state) => ({
  lon: state.products.lon,
  lat: state.products.lat,
  products: state.products.products,
});

export default productsSlice.reducer;
