import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRequest, useForm } from "../../hooks/hooks";
import validation from "../../form_validation/validation";
import Spinner from "../UI/Spinner";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import Message from "./Message";

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
  const history = useHistory();
  if (!location.state) {
    history.push("/profile/chats");
  }
  const { recipientId, recipientName, recipientImg } = location.state;
  const onSubmit = (e) => {
    processMsg("/api/chat/send_message", "POST", formData, true);
  };
  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm({ body: "", recipient_id: recipientId }, onSubmit, validation);
  const [, setNotifState] = useContext(ModalMsgContext);

  const onDeleteMsg = (msgId) => {
    processMsg("/api/chat/delete_message", "POST", { msg_id: msgId }, true);
  };

  useEffect(() => {
    sendRequest(
      "/api/chat/get_chat_between_users",
      "POST",
      {
        recipient_id: recipientId,
      },
      true
    );
  }, []);

  useEffect(() => {
    if (error) {
      setNotifState({
        open: true,
        msg: error,
        classes: "mdl-error",
      });
    } else if (data) {
      setFormData({ ...formData, chat_id: data.chat_id });
      setChatMsgs([...data.msgs]);
    }
  }, [error, errorNum, data]);

  useEffect(() => {
    if (errorMsg) {
      setNotifState({
        open: true,
        msg: errorMsg,
        classes: "mdl-error",
      });
    } else if (dataMsg) {
      sendRequest(
        "/api/chat/get_chat_messages",
        "POST",
        {
          chat_id: data.chat_id,
        },
        true
      );
      setFormData({ ...formData, body: "" });
    }
  }, [dataMsg, errorMsg, errorNumMsg]);

  useEffect(() => {
    bottom.current && bottom.current.scrollIntoView();
  }, [chatMsgs]);

  return (
    <>
      {isLoading && <Spinner />}
      <h1>Chat with {recipientName}</h1>
      <div className="chat-scroll">
        {chatMsgs &&
          chatMsgs.map((msg, i) => {
            const sender =
              parseInt(msg.sender_id) === parseInt(recipientId)
                ? recipientName
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
      }
    </>
  );
};

export default Chat;
