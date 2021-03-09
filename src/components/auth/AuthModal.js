import { useState } from "react";
import Auth from "../../components/auth/Auth";
import "./auth.css";
import classnames from "classnames";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const AuthModal = ({closeModal, afterConfirm}) => {
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
      <button
        disabled={view === "login"}
        className={classnames("authButton", { active: view === "login" })}
        onClick={switchComponents}
      >
        Log In
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
            <Auth view={view} inModal={true} closeModal={closeModal} afterConfirm={afterConfirm}/>
          ) : (
            <Auth view={view} inModal={true} closeModal={closeModal} afterConfirm={afterConfirm}/>
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default AuthModal;
