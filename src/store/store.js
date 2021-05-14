import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import profileReducer from "./profileSlice";
import productsReducer from "./productsSlice";
import currentPageReducer from "./currentPageSlice";

export default configureStore({
  reducer: {
    modal: modalReducer,
    profile: profileReducer,
    products: productsReducer,
    currentPage: currentPageReducer,
  },
});
