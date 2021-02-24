import { Icon, InlineIcon } from "@iconify/react";
import baselineVerified from "@iconify-icons/ic/baseline-verified";
import outlineVerified from "@iconify-icons/ic/outline-verified";

const EmailConfirmIcon = (props) => {
  return (
    <div>
      {props.children}
      <span className="tooltip">
        <InlineIcon
          icon={props.email_verified ? baselineVerified : outlineVerified}
          width="30"
          height="30"
          color={props.email_verified && "#4E9340"}
        />
        <span className="tooltiptext">
          {props.email_verified ? "Email verified" : "Email not verified"}
        </span>
      </span>
    </div>
  );
};

export default EmailConfirmIcon;
