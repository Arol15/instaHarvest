import React, { useState } from "react";

const ModalMsgContext = React.createContext();

const ModalMsgContextProvider = (props) => {
  const [state, setState] = useState({
    open: false,
    msg: null,
    classes: null,
  });

  return (
    <ModalMsgContext.Provider value={[state, setState]}>
      {props.children}
    </ModalMsgContext.Provider>
  );
};

export { ModalMsgContext, ModalMsgContextProvider };
