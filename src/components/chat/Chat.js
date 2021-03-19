import { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRequest, useForm } from "../../hooks/hooks";
import validation from "../../form_validation/validation";
import Spinner from "../UI/Spinner";
import Message from "./Message";
import { IoReload, IoArrowBack } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { showMsg } from "../../store/modalSlice";

const Chat = () => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [
    isLoadingMsg,
    dataMsg,
    errorMsg,
    errorNumMsg,
    processMsg,
  ] = useRequest();
  const [chatMsgs, setChatMsgs] = useState(null);
  const bottom = useRef();
  const location = useLocation();
  const [chatState, setChatState] = useState(
    location.state ? { ...location.state } : null
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    processMsg("/api/chat/send_message", "POST", formData, true);
  };
  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm(
    { body: "", recipient_id: chatState && chatState.recipientId },
    onSubmit,
    validation
  );

  const onDeleteMsg = (msgId) => {
    processMsg("/api/chat/delete_message", "DELETE", { msg_id: msgId }, true);
  };

  useEffect(() => {
    if (!chatState) {
      history.push("/chats");
    }
    sendRequest(
      "/api/chat/get_chat_between_users",
      "POST",
      {
        recipient_id: chatState && chatState.recipientId,
      },
      true
    );
  }, []);

  const getMessages = (e) => {
    e && e.preventDefault();
    sendRequest(
      "/api/chat/get_chat_messages",
      "POST",
      {
        chat_id: data.chat_id,
      },
      true
    );
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
      setFormData({ ...formData, chat_id: data.chat_id });
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
        {isLoading && <Spinner />}
        <div className="chat-header">
          <h1>Chat with {chatState && chatState.recipientName}</h1>
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
                parseInt(chatState && chatState.recipientId)
                  ? chatState && chatState.recipientName
                  : "Me";
              return (
                <div key={i} ref={i === chatMsgs.length - 1 ? bottom : null}>
                  <Message
                    msgId={msg.msg_id}
                    onDeleteMsg={onDeleteMsg}
                    createdAt={msg.created_at_str}
                    sender={sender}
                    body={msg.body}
                    image={msg.sender_img}
                  />
                </div>
              );
            })}
        </div>
        {
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
              <button onClick={getMessages}>
                <IoReload />
              </button>
            </form>
          </div>
        }
      </div>
    )
  );
};

export default Chat;
