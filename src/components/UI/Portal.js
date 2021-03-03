import { useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

const Portal = ({ children, parent }) => {
  const el = useMemo(() => document.createElement("div"), []);
  useEffect(() => {
    const target = parent && parent.appendChild ? parent : document.body;
    target.appendChild(el);

    return () => {
      target.removeChild(el);
    };
  }, [el, parent]);
  return ReactDOM.createPortal(children, el);
};
export default Portal;
