import { useState } from "react";
import classnames from "classnames";
import "./toggleInput.css";

const ToggleInput = ({
  name,
  handleInputChange,
  inputValue,
  formData,
  setFormData,
}) => {
  const [posLeft, setPos] = useState(true);

  const onClick = () => {
    if (posLeft) {
      setPos(false);
    } else {
      setFormData({ ...formData, [name]: 0 });
      setPos(true);
    }
  };

  return (
    <div className="switch">
      <span
        className={classnames("switch-click", { "switch-click-left": posLeft })}
        onClick={onClick}
      ></span>
      <span
        className={classnames("switch-text", { "switch-text-right": !posLeft })}
      >
        Free
      </span>
      <span
        className={classnames("slider", { "slider-right": !posLeft })}
      ></span>

      <input
        className={classnames("switch-input", { "switch-input-hide": posLeft })}
        type="number"
        placeholder={"$"}
        onChange={handleInputChange}
        value={inputValue}
      ></input>
    </div>
  );
};

export default ToggleInput;
