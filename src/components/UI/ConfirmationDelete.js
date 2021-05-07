import { Button } from "../styled/styled";

const ConfirmationDelete = ({ title, onYes, onNo }) => {
  return (
    <>
      <h3>{title}</h3>
      <Button onClick={onYes}>Yes</Button>
      <Button onClick={onNo}>No</Button>
    </>
  );
};

export default ConfirmationDelete;
