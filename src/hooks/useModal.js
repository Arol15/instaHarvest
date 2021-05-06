import { useRef, useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";

import Portal from "../components/UI/Portal";
import { FiX } from "react-icons/fi";

import { showMsg } from "../store/modalSlice";
import styled from "styled-components";
import classnames from "classnames";
import "./useModal.css";

const InPlaceMessage = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: opacity 300ms;
  opacity: ${(props) => (props.active ? "1" : "0")};
  text-align: center;
  border-radius: 0 0 10px 10px;
  background-color: ${(props) => {
    if (props.type === "error") {
      return "#e61e14e6";
    }
    if (props.type === "ok") {
      return "#4ac723e6";
    }
  }};
`;

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
        style: action.style,
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
 *
 * ```
 *  const {modal, showModal, closeModal, isOpen} = useModal({ withBackdrop, useTimer, inPlace, timeOut, disableClose });
 * ```
 * ```
 * showModal(children, style);
 * ```
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
    style: null,
    modal: null,
  });
  const backdrop = useRef(null);
  const dispatch = useDispatch();
  const showModal = (children, style) => {
    dispatchFetch({ type: "setOpen", isOpen: true });
    dispatchFetch({
      type: "setChildren",
      children: children,
      style: style,
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
          type: fetchState.style,
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
          <InPlaceMessage
            active={fetchState.active && fetchState.isOpen}
            type={fetchState.style}
          >
            {fetchState.children}
          </InPlaceMessage>
        ),
      });
    } else {
      <></>;
    }
  }, [fetchState.active, fetchState.isOpen, fetchState.children]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    modal: fetchState.modal,
    showModal,
    closeModal,
    isOpen: fetchState.isOpen,
  };
};

export default useModal;
