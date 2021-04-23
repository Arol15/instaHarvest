import "./tooltip.css";

const Tooltip = ({ children, text }) => {
  return (
    <div>
      <span className="tooltip-body">
        {children}
        <span className="tooltip-text">{text}</span>
      </span>
    </div>
  );
};

export default Tooltip;
