import { useState, memo } from "react";

import DropDownMenu from "../UI/DropDownMenu";
import { MdMoreVert } from "react-icons/md";
import { ButtonIcon, ButtonLinkMenu } from "../styled/styled";

import classnames from "classnames";
import "./chat.css";

const Message = ({ msgId, onDeleteMsg, body, createdAt, sender, image }) => {
  const splitMsg = body.split("\n").map((e, i) => {
    return <p key={i}>{e}</p>;
  });
  const [openMenu, setOpenMenu] = useState(false);

  const deleteMsg = () => {
    onDeleteMsg(msgId);
    setOpenMenu(!openMenu);
  };

  const onClick = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div
      className={classnames(
        "msg-container",
        sender === "Me" ? "msg-cnt-self" : "msg-cnt-reciv"
      )}
    >
      {sender !== "Me" && <img className="chat-img" src={image} alt={sender} />}
      <div
        className={classnames(
          "msg-body",
          sender === "Me" ? "msg-body-self" : "msg-body-reciv"
        )}
      >
        {splitMsg}
        <p>{createdAt}</p>
      </div>
      {sender === "Me" && (
        <DropDownMenu
          open={openMenu}
          button={
            <ButtonIcon className="msg-menu-button" onClick={onClick}>
              <MdMoreVert />
            </ButtonIcon>
          }
          onClick={onClick}
        >
          <ButtonLinkMenu onClick={deleteMsg}>Delete</ButtonLinkMenu>
        </DropDownMenu>
      )}
    </div>
  );
};

export default memo(Message);
