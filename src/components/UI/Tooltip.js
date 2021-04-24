import classnames from "classnames";
import "./tooltip.css";

const Tooltip = ({ children, text, classes }) => {
  return (
    <div>
      <span className="tooltip-body">
        {children}
        <span className={classnames("tooltip-text", classes)}>{text}</span>
      </span>
    </div>
  );
};

export default Tooltip;
