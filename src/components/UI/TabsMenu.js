import classnames from "classnames";
import "./tabsMenu.css";

const TabsMenu = ({ tabs, currTab }) => {
  return (
    <div className="tabs-menu">
      <hr />
      <div className="tabs-container">
        {tabs.map((tab, ind) => {
          return (
            <div
              key={ind}
              className={classnames({
                "tabs-menu-active": currTab === tab.name,
              })}
              onClick={tab.onClick}
            >
              {" "}
              {tab.title}
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default TabsMenu;
