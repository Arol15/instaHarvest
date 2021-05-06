import { useEffect } from "react";
import { useRequest } from "../../hooks/hooks";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Spinner from "../UI/Spinner";

import { showMsg } from "../../store/modalSlice";
import { datetimeToLocal } from "../../utils/utils";
import "./chat.css";
// import io from "socket.io-client";

// const socket = io.connect(`${endPoint}`);

const UserChatsPage = () => {
  const { isLoading, data, error, errorNum, sendRequest } = useRequest();
  const dispatch = useDispatch();
  const history = useHistory();
  const openChat = (chat) => {
    history.push({
      pathname: `/chats/${chat.recipient_name}`,
      state: {
        ...chat,
      },
    });
  };

  useEffect(() => {
    sendRequest("/api/chat/get_user_chats", "POST", {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    }
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      {data &&
        data.chats.map((chat, i) => {
          if (chat.last_date) {
            return (
              <div
                key={i}
                className="chat-user-chats"
                onClick={() => openChat(chat)}
              >
                <img className="chat-img" src={chat.recipient_img} alt="" />
                <div className="chat-last-msg">
                  <b>{chat.recipient_name}</b>
                  <p>
                    <i>{chat.last_message}</i>
                  </p>
                  <p>{datetimeToLocal(chat.last_date)}</p>
                </div>
              </div>
            );
          }
          return;
        })}
    </>
  );
};

export default UserChatsPage;
