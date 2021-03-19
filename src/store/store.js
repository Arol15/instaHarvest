import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
// import profileSlice from "../features/profileSlice";

export default configureStore({
  reducer: {
    modal: modalReducer,
    // profile: profileReducer,
  },
});
