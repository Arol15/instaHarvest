import { useEffect, useRef } from "react";
import classnames from "classnames";
import "./dropDownMenu.css";
const DropDownMenu = ({ children, open, button, onClick }) => {
  const refer = useRef(null);
  useEffect(() => {
    const clickEvent = (e) => {
      if (refer.current !== null && !refer.current.contains(e.target)) {
        onClick();
      }
    };
    if (open) {
      window.addEventListener("click", clickEvent);

      return () => {
        window.removeEventListener("click", clickEvent);
      };
    }
  }, [open]);

  return (
    <div className="menu-container">
      {button}
      <nav ref={refer} className={classnames("menu", { "menu-active": open })}>
        {children}
      </nav>
    </div>
  );
};

export default DropDownMenu;
