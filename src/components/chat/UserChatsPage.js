import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";
import { useHistory } from "react-router-dom";
import "./chat.css";
import { useDispatch } from "react-redux";
import { showMsg } from "../../store/modalSlice";
import Spinner from "../UI/Spinner";
import { datetimeToLocal } from "../../utils/datetime";

// import io from "socket.io-client";

// const socket = io.connect(`${endPoint}`);

const UserChatsPage = () => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const dispatch = useDispatch();
  const history = useHistory();
  const openChat = (recipientId, recipientName, recipientImg) => {
    history.push({
      pathname: `/chats/${recipientName}`,
      state: {
        recipientId: recipientId,
        recipientName: recipientName,
        recipientImg: recipientImg,
      },
    });
  };

  useEffect(() => {
    sendRequest("/api/chat/get_user_chats", "POST", {});
  }, []);

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error, errorNum]);

  // const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState(["Hello"]);

  // useEffect(() => {
  //   getMessages();
  // }, [messages.length]);

  // const onClick = () => {
  //   console.log(message);
  //   socket.emit("message", message);
  //   setMessage("");
  // };

  // const onChange = (e) => {
  //   setMessage(e.target.value);
  // };

  // const getMessages = () => {
  //   socket.on("message", (msg) => {
  //     setMessages([...messages, msg]);
  //   });
  // };

  return (
    <>
      {/* <h1>Messages</h1>
      {messages.map((msg, i) => (
        <div key={i}>
          <p>{msg}</p>
        </div>
      ))}
      <input value={message} name="message" onChange={(e) => onChange(e)} />
      <button onClick={() => onClick()}>Send</button> */}
      {isLoading && <Spinner />}
      {data &&
        data.chats.map((chat, i) => {
          return (
            <div
              key={i}
              className="chat-user-chats"
              onClick={() =>
                openChat(
                  chat.recipient_id,
                  chat.recipient_name,
                  chat.recipient_img
                )
              }
            >
              <img className="chat-img" src={chat.recipient_img} />
              <div className="chat-last-msg">
                <b>{chat.recipient_name}</b>
                <p>
                  <i>{chat.last_message}</i>
                </p>
                <p>{datetimeToLocal(chat.last_date)}</p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default UserChatsPage;
