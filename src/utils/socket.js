import io from "socket.io-client";
import config from "../config";

export let socket;

export const connectSocket = (chat_id) => {
  socket = io(config.endPoint);
  if (socket && chat_id) {
    socket.emit("join", chat_id);
  }
};

export const disconnectSocket = (chat_id) => {
  if (socket) {
    socket.emit("leave", chat_id);
    socket.disconnect();
  }
};

export const subscribeToChat = (cbSend, cbDelete) => {
  if (!socket) {
    return true;
  }
  socket.on("send_msg", (data) => {
    return cbSend(null, data);
  });
  socket.on("delete_msg", () => {
    return cbDelete();
  });
};

export const sendMessage = (data, chat_id, user_id) => {
  if (socket) {
    socket.emit("send_msg", {
      ...data,
      chat_id,
      user_id,
    });
  }
};

export const deleteMessage = (msg_id, chat_id) => {
  if (socket) {
    socket.emit("delete_msg", {
      chat_id,
      msg_id,
    });
  }
};
