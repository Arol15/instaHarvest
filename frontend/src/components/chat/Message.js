const Message = ({ body, createdAt, sender, recipientName }) => {
  const splitMsg = body.split("\n").map((e, i) => {
    return <p key={i}>{e}</p>;
  });

  return (
    <>
      <p>{sender}:</p>
      {splitMsg}
      <p>{createdAt}</p>
      <hr />
    </>
  );
};

export default Message;
