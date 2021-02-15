import { useRef, useState, useEffect } from "react";

import Portal from "./Portal";
import classNames from "classNames";
import "./Modal.css";

const Modal = (props) => {
  const [active, setActive] = useState(false);
  const { open, onClose } = props;
  const backdrop = useRef(null);

  useEffect(() => {
    const { current } = backdrop;
    const transitionEnd = () => setActive(open);
    const keyHandler = (event) => [27].indexOf(event.which) >= 0 && onClose();
    const clickHandler = (event) => event.target === current && onClose();

    if (current) {
      current.addEventListener("transitionend", transitionEnd);
      current.addEventListener("click", clickHandler);
      window.addEventListener("keyup", keyHandler);
    }

    if (open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        setActive(open);
      }, 10);
    }

    return () => {
      if (current) {
        current.removeEventListener("transitionend", transitionEnd);
        current.removeEventListener("click", clickHandler);
      }
      window.removeEventListener("keyup", keyHandler);
    };
  }, [open, onClose]);
  return (
    <>
      {(open || active) && (
        <Portal>
          <div
            ref={backdrop}
            className={classNames("backdrop", { "bd-active": active && open })}
          >
            <div
              className={classNames("modal", { "mdl-active": active && open })}
            >
              {props.children}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Modal;
