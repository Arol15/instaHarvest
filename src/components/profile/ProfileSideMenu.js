import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useWidth } from "../../hooks/hooks";

import { FiUser, FiUsers, FiHome, FiMenu, FiX } from "react-icons/fi";

import classnames from "classnames";

const ProfileSideMenu = ({ currTab }) => {
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const isDesktop = useWidth(1300);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeOnMobile = () => {
    if (!isDesktop) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    setShowMenu(isDesktop);
  }, [isDesktop]);

  return (
    <div
      className={classnames("prf-side-menu", {
        "prf-side-menu-closed": !showMenu,
      })}
    >
      <div className="prf-side-content">
        <div onClick={toggleMenu} className="prf-side-hamb">
          {showMenu ? <FiX /> : <FiMenu />}
        </div>
        <p
          className={classnames({ "prf-side-active": !currTab })}
          onClick={() => {
            currTab && history.push("/profile/edit");
            closeOnMobile();
          }}
        >
          <span>
            <FiUsers />
          </span>

          <span
            className={classnames("prf-side-title", {
              "prf-side-title-closed": !showMenu,
            })}
          >
            Public information
          </span>
        </p>
        <p
          className={classnames({ "prf-side-active": currTab === "private" })}
          onClick={() => {
            currTab !== "private" && history.push("/profile/edit/private");
            closeOnMobile();
          }}
        >
          <span>
            <FiUser />
          </span>
          <span
            className={classnames("prf-side-title", {
              "prf-side-title-closed": !showMenu,
            })}
          >
            Private information
          </span>
        </p>
        <p
          className={classnames({ "prf-side-active": currTab === "address" })}
          onClick={() => {
            currTab !== "address" && history.push("/profile/edit/address");
            closeOnMobile();
          }}
        >
          <span>
            <FiHome />
          </span>
          <span
            className={classnames("prf-side-title", {
              "prf-side-title-closed": !showMenu,
            })}
          >
            Address
          </span>
        </p>
      </div>
      <div className="prf-side-back">
        <div
          className={classnames("prf-back-left", {
            "prf-back-left-closed": !showMenu,
          })}
        ></div>
        <div
          className={classnames("prf-back-right", {
            "prf-back-right-closed": !showMenu,
          })}
        ></div>
      </div>
    </div>
  );
};

export default ProfileSideMenu;
