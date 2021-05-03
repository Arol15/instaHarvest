const ConfirmationDelete = ({ title, onYes, onNo }) => {
  return (
    <>
      <h3>{title}</h3>
      <button onClick={onYes}>Yes</button>
      <button onClick={onNo}>No</button>
    </>
  );
};

export default ConfirmationDelete;
