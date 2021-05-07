import { VscUnverified } from "react-icons/vsc";
import { GoVerified } from "react-icons/go";
import Tooltip from "./Tooltip";

const EmailConfirmIcon = ({ verified, children }) => {
  return (
    <Tooltip text={verified ? "Email verified" : "Email not verified"}>
      {children}
      {verified ? (
        <GoVerified size={"24px"} color={"#4e9340"} />
      ) : (
        <VscUnverified size={"24px"} />
      )}
    </Tooltip>
  );
};

export default EmailConfirmIcon;
