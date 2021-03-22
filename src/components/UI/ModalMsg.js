import { useState, useEffect } from "react";
import Portal from "./Portal";
import classnames from "classnames";
import { clearMsg, selectModal } from "../../store/modalSlice";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import "../../index.css";

const ModalMsg = () => {
  const { open, msg, timeOut, classes } = useSelector(
    selectModal,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        setActive(open);
      }, 10);
    }
  }, [open]);

  useEffect(() => {
    let id;
    if (open) {
      id = setTimeout(
        () => {
          dispatch(clearMsg());
        },
        timeOut ? timeOut : 7000
      );
    }
    return () => {
      clearTimeout(id);
    };
  }, [open]);

  useEffect(() => {
    let id;
    if (open) {
      id = setTimeout(
        () => {
          setActive(false);
        },
        timeOut ? timeOut - 1000 : 6000
      );
    }
    return () => {
      clearTimeout(id);
    };
  }, [active]);

  return (
    <>
      {(open || active) && (
        <Portal>
          <div
            className={classnames("mdl-msg", classes, {
              "mdl-msg-active": active,
            })}
          >
            {msg}
          </div>
        </Portal>
      )}
    </>
  );
};

export default ModalMsg;
