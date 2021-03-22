import "./Spinner.css";

const Spinner = (props) => {
  const el = (
    <div className="center">
      <div className="indicator">
        <div className="ind-chase-dot"></div>
        <div className="ind-chase-dot"></div>
        <div className="ind-chase-dot"></div>
        <div className="ind-chase-dot"></div>
        <div className="ind-chase-dot"></div>
        <div className="ind-chase-dot"></div>
      </div>
    </div>
  );

  return el;
};

export default Spinner;
