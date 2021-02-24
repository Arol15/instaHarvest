import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRequest, useForm } from "../../hooks/hooks";
import validation from "../../form_validation/validation";
import Spinner from "../UI/Spinner";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import Message from "./Message";

const Chat = () => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [isLoadingMsg, dataMsg, errorMsg, errorNumMsg, sendMsg] = useRequest();
  const [chatMsgs, setChatMsgs] = useState(null);
  const bottom = useRef();
  const location = useLocation();
  const history = useHistory();
  if (!location.state) {
    history.push("/profile/chats");
  }
  const { recipientId, recipientName, recipientImg } = location.state;
  const onSubmit = (e) => {
    sendMsg("/api/chat/send_message", "POST", formData, true);
  };
  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm({ body: "", recipient_id: recipientId }, onSubmit, validation);
  const [, setNotifState] = useContext(ModalMsgContext);

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
    bottom && bottom.current.scrollIntoView();
  }, [chatMsgs]);

  return (
    <>
      {isLoading && <Spinner />}
      {chatMsgs &&
        chatMsgs.map((msg, i) => {
          const sender =
            parseInt(msg.sender_id) === parseInt(recipientId)
              ? recipientName
              : "Me";

          return (
            <Message
              key={i}
              createdAt={msg.created_at_str}
              sender={sender}
              recipientName={recipientName}
              body={msg.body}
            />
          );
        })}
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
          <button ref={bottom} onClick={handleSubmit}>
            Send
          </button>
        </form>
      }
    </>
  );
};

export default Chat;
