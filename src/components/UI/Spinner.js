import "./Spinner.css";
import { shallowEqual, useSelector } from "react-redux";
import { selectSpinner } from "../../store/spinnerSlice";

const Spinner = (props) => {
  console.log("SPINNER");
  const show = useSelector(selectSpinner, shallowEqual);
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

  return show && el;
};

export default Spinner;
