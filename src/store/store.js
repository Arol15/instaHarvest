import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import profileReducer from "./profileSlice";
import spinnerReducer from "./spinnerSlice";

export default configureStore({
  reducer: {
    modal: modalReducer,
    profile: profileReducer,
    spinner: spinnerReducer,
  },
});
