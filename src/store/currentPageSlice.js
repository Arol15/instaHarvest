import { createSlice } from "@reduxjs/toolkit";

export const currentPageSlice = createSlice({
  name: "currentPage",
  initialState: {
    homePage: false,
  },
  reducers: {
    setHomePage: (state, action) => {
      state.homePage = action.payload;
    },
  },
});

export const { setHomePage } = currentPageSlice.actions;

export const isHomePage = (state) => state.currentPage.homePage;

export default currentPageSlice.reducer;
