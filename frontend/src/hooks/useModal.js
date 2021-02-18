import { useRef, useEffect, useReducer } from "react";

import Portal from "../components/UI/Portal";
import classnames from "classnames";
import "./useModal.css";

const fetchReducer = (currState, action) => {
  switch (action.type) {
    case "setActive":
      return {
        ...currState,
        active: action.active,
      };
    case "setChildren":
      return {
        ...currState,
        children: action.children,
        classes: action.classes,
      };

    case "setOpen":
      return {
        ...currState,
        open: action.open,
      };
    case "setModal":
      return {
        ...currState,
        modal: action.modal,
      };
    default:
      break;
  }
};

const useModal = ({ withBackdrop, useTimer, timeOut, inPlace }) => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    active: false,
    open: false,
    children: null,
    classes: null,
    modal: null,
  });
  const backdrop = useRef(null);
  const showModal = (children, classes) => {
    dispatchFetch({ type: "setOpen", open: true });
    dispatchFetch({
      type: "setChildren",
      children: children,
      classes: classes,
    });
  };

  const onClose = () => {
    dispatchFetch({ type: "setOpen", open: false });
  };

  useEffect(() => {
    if (withBackdrop === true) {
      const { current } = backdrop;
      const transitionEnd = () =>
        dispatchFetch({ type: "setActive", active: fetchState.open });
      const keyHandler = (event) => [27].indexOf(event.which) >= 0 && onClose();
      const clickHandler = (event) => event.target === current && onClose();

      if (current) {
        current.addEventListener("transitionend", transitionEnd);
        current.addEventListener("click", clickHandler);
        window.addEventListener("keyup", keyHandler);
      }

      return () => {
        if (current) {
          current.removeEventListener("transitionend", transitionEnd);
          current.removeEventListener("click", clickHandler);
        }
        window.removeEventListener("keyup", keyHandler);
      };
    }
  }, [fetchState.open, fetchState.modal]);

  useEffect(() => {
    if (fetchState.open) {
      window.setTimeout(() => {
        document.activeElement.blur();
        dispatchFetch({ type: "setActive", active: fetchState.open });
      }, 10);
    }
  }, [fetchState.open]);

  useEffect(() => {
    if (fetchState.open && useTimer) {
      setTimeout(
        () => {
          onClose();
        },
        timeOut ? timeOut : 5000
      );
    }
  }, [fetchState.open]);

  useEffect(() => {
    if (withBackdrop) {
      dispatchFetch({
        type: "setModal",
        modal: (
          <div>
            {(fetchState.open || fetchState.active) && (
              <Portal>
                <div
                  ref={backdrop}
                  className={classnames("backdrop", {
                    "bd-active": fetchState.active && fetchState.open,
                  })}
                >
                  <div
                    className={classnames("modal", {
                      "mdl-active": fetchState.active && fetchState.open,
                    })}
                  >
                    {fetchState.children}
                  </div>
                </div>
              </Portal>
            )}
          </div>
        ),
      });
    } else if (inPlace) {
      dispatchFetch({
        type: "setModal",
        modal: (
          <div
            className={classnames("mdl-inpl", fetchState.classes, {
              "mdl-inpl-active": fetchState.active && fetchState.open,
            })}
          >
            {fetchState.children}
          </div>
        ),
      });
    } else {
      dispatchFetch({
        type: "setModal",
        modal: (
          <div>
            {(fetchState.open || fetchState.active) && (
              <Portal>
                <div
                  className={classnames("mdl-msg", fetchState.classes, {
                    "mdl-active": fetchState.active && fetchState.open,
                  })}
                >
                  {fetchState.children}
                </div>
              </Portal>
            )}
          </div>
        ),
      });
    }
  }, [fetchState.active, fetchState.open, fetchState.children]);

  return [fetchState.modal, showModal, onClose];
};

export default useModal;
