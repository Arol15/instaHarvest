import { useState, useEffect, useContext, useRef } from "react";
import { useRequest, useForm } from "../../hooks/hooks";
import validation from "../../form_validation/validation";
import Spinner from "../UI/Spinner";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import Message from "./Message";

const Chat = ({ recipient_id, recipient_name }) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [isLoadingMsg, dataMsg, errorMsg, errorNumMsg, sendMsg] = useRequest();
  const [chatMsgs, setChatMsgs] = useState(null);
  const bottom = useRef();
  const onSubmit = (e) => {
    sendMsg("/api/chat/send_message", "POST", formData, true);
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm({ body: "", recipient_id: recipient_id }, onSubmit, validation);
  const [, setNotifState] = useContext(ModalMsgContext);
  useEffect(() => {
    sendRequest(
      "/api/chat/get_chat_between_users",
      "POST",
      {
        recipient_id: recipient_id,
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
      setChatMsgs([...chatMsgs, dataMsg]);
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
            parseInt(msg.sender_id) === parseInt(recipient_id)
              ? recipient_name
              : "Me";

          return (
            <Message
              key={i}
              created_at={msg.created_at_str}
              sender={sender}
              recipient_name={recipient_name}
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
