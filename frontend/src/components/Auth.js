import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";
import classnames from "classnames";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const Auth = () => {
  const [showSignup, setShowSignup] = useState(true);

  const switchComponents = () => {
    setShowSignup(!showSignup);
  };
  return (
    <div>
      <button
        disabled={!showSignup}
        className={classnames("authButton", { active: !showSignup })}
        onClick={switchComponents}
      >
        Login
      </button>
      <button
        disabled={showSignup}
        className={classnames("authButton", { active: showSignup })}
        onClick={switchComponents}
      >
        Sign Up
      </button>

      <SwitchTransition>
        <CSSTransition
          key={showSignup ? "1" : "2"}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          {showSignup ? <Signup inModal={true} /> : <Login inModal={true} />}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default Auth;
