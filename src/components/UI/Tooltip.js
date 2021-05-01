import "./tooltip.css";

const Tooltip = ({ children, text, style }) => {
  return (
    <div>
      {!text ? (
        children
      ) : (
        <span className="tooltip-body">
          {children}
          <span className="tooltip-text" style={style}>
            {text}
          </span>
        </span>
      )}
    </div>
  );
};

export default Tooltip;
