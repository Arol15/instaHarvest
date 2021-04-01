import { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRequest, useForm } from "../../hooks/hooks";
import validation from "../../form_validation/validation";
import Message from "./Message";
import Spinner from "../UI/Spinner";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { showMsg } from "../../store/modalSlice";
import { datetimeToLocal } from "../../utils/datetime";
import {
  connectSocket,
  disconnectSocket,
  subscribeToChat,
  sendMessage,
  deleteMessage,
} from "../../utils/socket";

const Chat = () => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [
    isLoadingMsg,
    dataMsg,
    errorMsg,
    errorNumMsg,
    processMsg,
  ] = useRequest();
  const [chatMsgs, setChatMsgs] = useState();
  const bottom = useRef();
  const location = useLocation();
  const [chatState, setChatState] = useState(
    location.state ? { ...location.state } : null
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const onSubmit = () => {
    sendMessage(formData, chatState.chat_id, chatState.user_id);
    setFormData({ ...formData, body: "" });
  };
  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm(
    { body: "", recipient_id: chatState && chatState.recipient_id },
    onSubmit,
    validation
  );

  const onDeleteMsg = (msgId) => {
    deleteMessage(msgId, chatState.chat_id);
  };

  useEffect(() => {
    if (!chatState) {
      history.push("/chats");
    }
    if (!location.chat_id) {
      sendRequest("/api/chat/get_chat_between_users", "POST", {
        recipient_id: chatState.recipient_id,
      });
    } else {
      getMessages();
    }
    connectSocket(chatState.chat_id);
    subscribeToChat(
      (err, msg) => {
        if (err) {
          return;
        }
        setChatMsgs((oldMsgs) => [...oldMsgs, msg]);
      },
      () => {
        getMessages();
      }
    );

    return () => {
      disconnectSocket(chatState.chat_id);
    };
  }, []);

  const getMessages = () => {
    sendRequest("/api/chat/get_chat_messages", "POST", {
      chat_id: chatState.chat_id,
    });
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    } else if (data) {
      setFormData({ ...formData, chat_id: chatState.chat_id });
      setChatMsgs([...data.msgs]);
    }
  }, [error, errorNum, data]);

  useEffect(() => {
    if (errorMsg) {
      dispatch(
        showMsg({
          open: true,
          msg: errorMsg,
          classes: "mdl-error",
        })
      );
    } else if (dataMsg) {
      getMessages();
      setFormData({ ...formData, body: "" });
    }
  }, [dataMsg, errorMsg, errorNumMsg]);

  useEffect(() => {
    bottom.current && bottom.current.scrollIntoView();
  }, [chatMsgs]);

  return (
    chatState && (
      <div className="chat">
        {(isLoading || isLoadingMsg) && <Spinner />}
        <div className="chat-header">
          <h1>Chat with {chatState && chatState.recipient_name}</h1>
          <button
            onClick={() => {
              history.goBack();
            }}
            className="chat-back-button"
          >
            <IoArrowBack />
          </button>
        </div>
        <div className="chat-scroll">
          {chatMsgs &&
            chatMsgs.map((msg, i) => {
              const sender =
                parseInt(msg.sender_id) ===
                parseInt(chatState && chatState.recipient_id)
                  ? chatState && chatState.recipient_name
                  : "Me";
              return (
                <div key={i} ref={i === chatMsgs.length - 1 ? bottom : null}>
                  <Message
                    msgId={msg.msg_id}
                    onDeleteMsg={onDeleteMsg}
                    createdAt={datetimeToLocal(msg.created_at)}
                    sender={sender}
                    body={msg.body}
                    image={msg.sender_img}
                  />
                </div>
              );
            })}
        </div>
        {chatMsgs && (
          <div className="chat-footer">
            <form>
              <textarea
                rows={3}
                type="text"
                name="body"
                onChange={handleInputChange}
                value={formData.body || ""}
              ></textarea>
              <div className="form-danger">
                {formErrors.body && formErrors.body}
              </div>
              <button onClick={handleSubmit}>Send</button>
            </form>
          </div>
        )}
      </div>
    )
  );
};

export default Chat;
