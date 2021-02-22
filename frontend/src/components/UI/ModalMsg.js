import { useContext, useState, useEffect } from "react";
import { ModalMsgContext } from "../../context/ModalMsgContext";
import Portal from "./Portal";
import classnames from "classnames";

const ModalMsg = (props) => {
  const [state, setState] = useContext(ModalMsgContext);
  const [active, setActive] = useState(false);

  useEffect(() => {
    console.log("Modal->useEffect");
    console.log(state);

    if (state.open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        setActive(state.open);
      }, 10);
    }
  }, [state]);

  useEffect(() => {
    let id;
    if (state.open) {
      id = setTimeout(
        () => {
          setState({
            open: false,
            msg: null,
            classes: null,
          });
        },
        state.timeOut ? state.timeOut : 7000
      );
    }
    return () => {
      clearTimeout(id);
    };
  }, [state]);

  useEffect(() => {
    let id;
    if (state.open) {
      id = setTimeout(
        () => {
          setActive(false);
        },
        state.timeOut ? state.timeOut - 1000 : 6000
      );
    }
    return () => {
      clearTimeout(id);
    };
  }, [active]);

  return (
    <>
      {(state.open || active) && (
        <Portal>
          <div
            className={classnames("mdl-msg", state.classes, {
              "mdl-msg-active": active,
            })}
          >
            {state.msg}
          </div>
        </Portal>
      )}
    </>
  );
};

export default ModalMsg;
