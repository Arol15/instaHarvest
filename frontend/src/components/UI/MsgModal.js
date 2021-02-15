import "./MsgModal.css";
import classnames from "classnames";

const MsgModal = (props) => {
  return <div className={classnames(...props.styles)}>{props.children}</div>;
};

export default MsgModal;
