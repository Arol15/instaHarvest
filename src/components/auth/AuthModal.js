import { useState } from "react";

import Auth from "../../components/auth/Auth";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { Button } from "../styled/buttons";

import classnames from "classnames";
import "./auth.css";

const AuthModal = ({ closeModal, afterConfirm }) => {
  const [view, setView] = useState("login");

  const switchComponents = () => {
    if (view === "login") {
      setView("signup");
    } else {
      setView("login");
    }
  };
  return (
    <div>
      <Button
        disabled={view === "login"}
        active={view === "login"}
        onClick={switchComponents}
      >
        Log In
      </Button>
      <Button
        disabled={view === "signup"}
        active={view === "signup"}
        onClick={switchComponents}
      >
        Sign Up
      </Button>

      <SwitchTransition>
        <CSSTransition
          key={view}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          {view === "signup" ? (
            <Auth
              view={view}
              inModal={true}
              closeModal={closeModal}
              afterConfirm={afterConfirm}
            />
          ) : (
            <Auth
              view={view}
              inModal={true}
              closeModal={closeModal}
              afterConfirm={afterConfirm}
            />
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default AuthModal;
