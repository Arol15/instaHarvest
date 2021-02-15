import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";
import classNames from "classNames";

const Auth = () => {
  const [showSignup, setShowSignup] = useState(true);
  const [showLogin, setShowSignin] = useState(false);

  const switchComponents = () => {
    setShowSignup(!showSignup);
    setShowSignin(!showLogin);
  };
  return (
    <>
      <button
        disabled={showLogin}
        className={classNames("authButton", { active: showLogin })}
        onClick={switchComponents}
      >
        Login
      </button>
      <button
        disabled={showSignup}
        className={classNames("authButton", { active: showSignup })}
        onClick={switchComponents}
      >
        Sign Up
      </button>

      {showLogin ? (
        <div className="auth">
          <Login />
        </div>
      ) : (
        <div className="auth">
          <Signup />
        </div>
      )}
    </>
  );
};

export default Auth;
