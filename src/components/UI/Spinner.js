import "./Spinner.css";
import { useSelector } from "react-redux";
import { selectSpinner } from "../../store/spinnerSlice";

const Spinner = (props) => {
  const show = useSelector(selectSpinner);
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
