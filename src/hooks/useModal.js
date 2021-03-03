import { useRef, useEffect, useReducer, useContext } from "react";
import Portal from "../components/UI/Portal";
import classnames from "classnames";
import "./useModal.css";
import { ModalMsgContext } from "../context/ModalMsgContext";

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
        isOpen: action.isOpen,
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

/**
 *  useModal
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useModal
 */

const useModal = ({ withBackdrop, useTimer, timeOut, inPlace }) => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    active: false,
    isOpen: false,
    children: null,
    classes: null,
    modal: null,
  });
  const backdrop = useRef(null);
  const showModal = (children, classes) => {
    dispatchFetch({ type: "setOpen", isOpen: true });
    dispatchFetch({
      type: "setChildren",
      children: children,
      classes: classes,
    });
  };

  const closeModal = () => {
    dispatchFetch({ type: "setOpen", isOpen: false });
  };
  const [, setMsgState] = useContext(ModalMsgContext);

  useEffect(() => {
    if (withBackdrop === true) {
      const { current } = backdrop;
      const transitionEnd = () =>
        dispatchFetch({ type: "setActive", active: fetchState.isOpen });
      const keyHandler = (event) =>
        [27].indexOf(event.which) >= 0 && closeModal();
      const clickHandler = (event) => event.target === current && closeModal();

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
  }, [fetchState.isOpen, fetchState.modal]);

  useEffect(() => {
    if (fetchState.isOpen && !withBackdrop && !inPlace) {
      setMsgState({
        open: true,
        msg: fetchState.children,
        classes: fetchState.classes,
      });
    } else if (fetchState.isOpen) {
      window.setTimeout(() => {
        document.activeElement.blur();
        dispatchFetch({ type: "setActive", active: fetchState.isOpen });
      }, 10);
    }
  }, [fetchState.isOpen]);

  useEffect(() => {
    let id;
    if (fetchState.isOpen && useTimer) {
      id = setTimeout(
        () => {
          closeModal();
        },
        timeOut ? timeOut : 5000
      );
    }
    return () => {
      if (useTimer) {
        clearTimeout(id);
      }
    };
  }, [fetchState.isOpen]);

  useEffect(() => {
    if (withBackdrop) {
      dispatchFetch({
        type: "setModal",
        modal: (
          <div>
            {(fetchState.isOpen || fetchState.active) && (
              <Portal>
                <div
                  ref={backdrop}
                  className={classnames("backdrop", {
                    "bd-active": fetchState.active && fetchState.isOpen,
                  })}
                >
                  <div
                    className={classnames("modal", {
                      "mdl-active": fetchState.active && fetchState.isOpen,
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
              "mdl-inpl-active": fetchState.active && fetchState.isOpen,
            })}
          >
            {fetchState.children}
          </div>
        ),
      });
    } else {
      <></>;
    }
  }, [fetchState.active, fetchState.isOpen, fetchState.children]);

  return [fetchState.modal, showModal, closeModal, fetchState.isOpen];
};

export default useModal;