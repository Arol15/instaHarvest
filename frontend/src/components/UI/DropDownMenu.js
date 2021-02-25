import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import "./dropDownMenu.css";
const DropDownMenu = ({
  children,
  open,
  button,
  onClick,
  classContainer,
  classMenu,
  classActive,
}) => {
  const [classes] = useState({
    clContainer: classContainer ? classContainer : "menu-container",
    clMenu: classMenu ? classMenu : "menu",
    clActive: classActive ? classActive : "menu-active",
  });

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
    <div className={classes.clContainer}>
      {button}
      <nav
        ref={refer}
        className={classnames(classes.clMenu, { [classes.clActive]: open })}
      >
        {children}
      </nav>
    </div>
  );
};

export default DropDownMenu;
