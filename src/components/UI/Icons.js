import icons from "../../assets/data/icons.json";
import "./icons.css";

const Icons = ({ onClick }) => {
  return (
    <div className="icons-grid">
      {icons.map((icon, ind) => {
        return (
          <div className="icons-icon-container border" key={ind}>
            <img
              onClick={() => onClick(icon.url)}
              src={icon.url}
              alt={icon.name}
            />
            <div className="icons-title">{icon.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Icons;
