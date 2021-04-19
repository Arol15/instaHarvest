import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    lat: null,
    lng: null,
    products: null,
  },
  reducers: {},
});

export const {} = productsSlice.actions;

export const selectProducts = (state) => ({
  lng: state.products.lng,
  lat: state.products.lat,
  products: state.products.products,
});

export default productsSlice.reducer;
