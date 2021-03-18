import classnames from "classnames";
import { FiUser, FiUsers, FiHome } from "react-icons/fi";
import { useHistory } from "react-router-dom";

const ProfileSideMenu = ({ isDesktop, currTab }) => {
  const history = useHistory();

  return (
    <div className="prf-side-menu">
      <ul>
        <li
          className={classnames({ "prf-li-active": !currTab })}
          onClick={() => {
            currTab && history.push("/profile/edit");
          }}
        >
          <span>
            <FiUsers />
          </span>
          Public information
        </li>
        <li
          className={classnames({ "prf-li-active": currTab === "private" })}
          onClick={() => {
            currTab !== "private" && history.push("/profile/edit/private");
          }}
        >
          <span>
            <FiUser />
          </span>
          Private information
        </li>
        <li
          className={classnames({ "prf-li-active": currTab === "address" })}
          onClick={() => {
            currTab !== "address" && history.push("/profile/edit/address");
          }}
        >
          <span>
            <FiHome />
          </span>
          Address
        </li>
      </ul>
    </div>
  );
};

export default ProfileSideMenu;
