import { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import Portal from "./Portal";

import { clearMsg, selectModal } from "../../store/modalSlice";
import styled from "styled-components";

const StyledMessage = styled.div`
  z-index: 100;
  width: 100%;
  position: fixed;
  bottom: 0;
  transform: ${(props) =>
    props.active ? "translateY(0)" : "translateY(50px)"};
  transition: all 300ms;
  opacity: ${(props) => (props.active ? "1" : "0")};
  text-align: center;
  padding: 10px 0;
  transition-duration: 500ms;
  background-color: ${(props) => {
    if (props.type === "error") {
      return "#e61e14e6";
    }
    if (props.type === "ok") {
      return "#4ac723e6";
    }
  }};
`;

const ModalMsg = () => {
  const { open, msg, timeOut, type } = useSelector(selectModal, shallowEqual);
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
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {(open || active) && (
        <Portal>
          <StyledMessage active={active} type={type}>
            {msg}
          </StyledMessage>
        </Portal>
      )}
    </>
  );
};

export default ModalMsg;
