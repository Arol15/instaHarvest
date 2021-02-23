const Message = ({ body, created_at, sender, recipient_name }) => {
  const splitMsg = body.split("\n").map((e, i) => {
    return <p key={i}>{e}</p>;
  });

  return (
    <>
      <p>{sender}:</p>
      {splitMsg}
      <p>{created_at}</p>
      <hr />
    </>
  );
};

export default Message;
