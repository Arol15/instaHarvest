import icons from "../../assets/data/icons.json";
import "./icons.css";

const Icons = ({ onClick }) => {
  return (
    <div className="icons-grid">
      {icons.map((icon, ind) => {
        return (
          <img
            onClick={() => onClick(icon.url)}
            key={ind}
            src={icon.url}
            alt={icon.name}
          />
        );
      })}
    </div>
  );
};

export default Icons;
