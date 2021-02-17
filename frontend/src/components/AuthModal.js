import { useState } from "react";
import Auth from "../pages/Auth";
import "./AuthModal.css";
import classnames from "classnames";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const AuthModal = () => {
  const [view, setView] = useState("signup");

  const switchComponents = () => {
    if (view === "login") {
      setView("signup");
    } else {
      setView("login");
    }
  };
  return (
    <div>
      <button
        disabled={view === "login"}
        className={classnames("authButton", { active: view === "login" })}
        onClick={switchComponents}
      >
        Login
      </button>
      <button
        disabled={view === "signup"}
        className={classnames("authButton", { active: view === "signup" })}
        onClick={switchComponents}
      >
        Sign Up
      </button>

      <SwitchTransition>
        <CSSTransition
          key={view}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          {view === "signup" ? (
            <Auth view={view} inModal={true} />
          ) : (
            <Auth view={view} inModal={true} />
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default AuthModal;
