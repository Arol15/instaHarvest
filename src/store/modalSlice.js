import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    msg: null,
    timeOut: null,
    classes: null,
  },
  reducers: {
    showMsg: (state, action) => {
      const { msg, timeOut, classes } = action.payload;
      state.open = true;
      state.msg = msg;
      state.timeOut = timeOut;
      state.classes = classes;
    },
    clearMsg: (state) => {
      state.open = false;
      state.msg = null;
      state.timeOut = null;
      state.classes = null;
    },
  },
});

export const { showMsg, clearMsg } = modalSlice.actions;

export const selectModal = (state) => ({
  open: state.modal.open,
  msg: state.modal.msg,
  timeOut: state.modal.timeOut,
  classes: state.modal.classes,
});

export default modalSlice.reducer;
