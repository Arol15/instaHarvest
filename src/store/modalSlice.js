import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    open: false,
    msg: null,
    timeOut: null,
    type: null,
  },
  reducers: {
    showMsg: (state, action) => {
      const { msg, timeOut, type } = action.payload;
      state.open = true;
      state.msg = msg;
      state.timeOut = timeOut;
      state.type = type;
    },
    clearMsg: (state) => {
      state.open = false;
      state.msg = null;
      state.timeOut = null;
      state.type = null;
    },
  },
});

export const { showMsg, clearMsg } = modalSlice.actions;

export const selectModal = (state) => ({
  open: state.modal.open,
  msg: state.modal.msg,
  timeOut: state.modal.timeOut,
  type: state.modal.type,
});

export default modalSlice.reducer;
