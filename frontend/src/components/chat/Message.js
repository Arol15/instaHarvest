const Message = ({ body, created_at, sender, recipient_name }) => {
  return (
    <>
      <p>{sender}:</p>
      <p>{body}</p>
      <p>{created_at}</p>
      <hr />
    </>
  );
};

export default Message;
