import { VscUnverified } from "react-icons/vsc";
import { GoVerified } from "react-icons/go";

const EmailConfirmIcon = ({ verified, children }) => {
  return (
    <div>
      {children}
      <span className="tooltip">
        {verified ? (
          <GoVerified size={"24px"} color={"#4e9340"} />
        ) : (
          <VscUnverified size={"24px"} />
        )}

        <span className="tooltiptext">
          {verified ? "Email verified" : "Email not verified"}
        </span>
      </span>
    </div>
  );
};

export default EmailConfirmIcon;
