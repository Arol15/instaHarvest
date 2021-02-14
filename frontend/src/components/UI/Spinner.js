import "./Spinner.css";
import { useRef } from "react";
import Portal from "./Portal";
import Modal from "./Modal";

const Spinner = (props) => {
  const el = (
    <div className={props.inPlace ? "inPlace" : "center"}>
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
  console.log(props.inPlace);

  return el;
};

export default Spinner;
