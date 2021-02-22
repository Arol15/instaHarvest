import Chat from "../components/chat/Chat";

const ChatPageTest = (props) => {
  return (
    <Chat recipient_id={props.match.params.id} recipient_name="Recipient" />
  );
};

export default ChatPageTest;
