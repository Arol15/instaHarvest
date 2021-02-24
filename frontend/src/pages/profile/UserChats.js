import { useEffect, useContext, useState } from "react";
import { useRequest } from "../../hooks/hooks";
import Spinner from "../../components/UI/Spinner";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import Chat from "../../components/chat/Chat";
import { useHistory } from "react-router-dom";
import "./UserChats.css";

const UserChats = () => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [, setModalMsgState] = useContext(ModalMsgContext);

  const history = useHistory();
  const openChat = (recipientId, recipientName, recipientImg) => {
    history.push({
      pathname: `/chat/${recipientName}`,
      state: {
        recipientId: recipientId,
        recipientName: recipientName,
        recipientImg: recipientImg,
      },
    });
  };

  useEffect(() => {
    sendRequest("/api/chat/get_user_chats", "POST", {}, true);
  }, []);

  useEffect(() => {
    if (error) {
      setModalMsgState({
        open: true,
        msg: error,
        classes: "mdl-error",
      });
    }
  }, [data, error, errorNum]);

  return (
    <>
      {isLoading && <Spinner />}
      {data &&
        data.chats.map((chat, i) => {
          return (
            <div
              key={i}
              className="prf-user-chats"
              onClick={() =>
                openChat(
                  chat.recipient_id,
                  chat.recipient_name,
                  chat.recipient_img
                )
              }
            >
              <img className="chat-img" src={chat.recipient_img} />
              <div>{chat.recipient_name}</div>
            </div>
          );
        })}
    </>
  );
};

export default UserChats;
