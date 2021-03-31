import io from "socket.io-client";
import config from "../config";
let socket;

export const connectSocket = (chat_id) => {
  socket = io(config.endPoint);
  console.log("Connecting socket...");
  if (socket && chat_id) {
    socket.emit("join", chat_id);
  }
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) {
    socket.emit("leave", chat_id);
    socket.disconnect();
  }
};

export const subscribeToChat = (cb) => {
  if (!socket) {
    return true;
  }
  socket.on("chat", (msg) => {
    console.log("Websocket event received!");
    return cb(null, msg);
  });
};

export const sendMessage = (message, chat_id) => {
  if (socket) {
    socket.emit("chat", { body: message, chat_id: chat_id });
  }
};
