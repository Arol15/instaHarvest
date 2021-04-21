import { useRef, useEffect, useReducer } from "react";
import Portal from "../components/UI/Portal";
import classnames from "classnames";
import "./useModal.css";
import { showMsg } from "../store/modalSlice";
import { useDispatch } from "react-redux";
import { FiX } from "react-icons/fi";

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

const useModal = ({
  withBackdrop,
  useTimer,
  timeOut,
  inPlace,
  disableClose,
}) => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    active: false,
    isOpen: false,
    children: null,
    classes: null,
    modal: null,
  });
  const backdrop = useRef(null);
  const dispatch = useDispatch();
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

        if (!disableClose) {
          current.addEventListener("click", clickHandler);
          window.addEventListener("keyup", keyHandler);
        }
      }

      return () => {
        if (current) {
          current.removeEventListener("transitionend", transitionEnd);
          if (!disableClose) {
            current.removeEventListener("click", clickHandler);
          }
        }
        if (!disableClose) {
          window.removeEventListener("keyup", keyHandler);
        }
      };
    }
  }, [fetchState.isOpen, fetchState.modal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fetchState.isOpen && !withBackdrop && !inPlace) {
      dispatch(
        showMsg({
          open: true,
          msg: fetchState.children,
          classes: fetchState.classes,
        })
      );
    } else if (fetchState.isOpen) {
      window.setTimeout(() => {
        document.activeElement.blur();
        dispatchFetch({ type: "setActive", active: fetchState.isOpen });
      }, 10);
    }
  }, [fetchState.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [fetchState.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
                    {disableClose && (
                      <div className="mdl-close-button" onClick={closeModal}>
                        <FiX />
                      </div>
                    )}
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
  }, [fetchState.active, fetchState.isOpen, fetchState.children]); // eslint-disable-line react-hooks/exhaustive-deps

  return [fetchState.modal, showModal, closeModal, fetchState.isOpen];
};

export default useModal;
