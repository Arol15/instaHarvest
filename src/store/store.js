import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import profileReducer from "./profileSlice";

export default configureStore({
  reducer: {
    modal: modalReducer,
    profile: profileReducer,
  },
});
