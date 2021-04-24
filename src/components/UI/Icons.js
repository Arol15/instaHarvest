import Tooltip from "../UI/Tooltip";

import icons from "../../assets/data/icons.json";
import "./icons.css";

const Icons = ({ onClick }) => {
  return (
    <div className="icons-grid">
      {icons.map((icon, ind) => {
        return (
          <Tooltip key={ind} text={icon.name} classes="icons-offset-top">
            <img
              onClick={() => onClick(icon.url)}
              src={icon.url}
              alt={icon.name}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};

export default Icons;
