import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "../components/UI/Spinner";
import useModal from "../hooks/useModal";
import AuthModal from "../components/AuthModal";

const Auth = ({ view, inModal }) => {
  // const [view, setView] = useState(props.view)
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: inModal ? true : false,
  });

  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    history.push("/profile");
  }

  const onSubmit = (formData) => {
    console.log(formData);
    sendRequest(
      view === "login" ? "api/auth/login" : "api/auth/signup",
      "post",
      formData
    );
  };

  useEffect(() => {
    if (data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      history.push("/profile");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      showModal(error, "mdl-error");
    } else if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
    }
  }, [error, errorNum, data]);

  return (
    <div>
      {modal}
      <h1>{view === "login" ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {view === "signup" && (
          <input
            type="text"
            placeholder="Username"
            name="username"
            ref={register}
          />
        )}
        {view === "login" ? (
          <input
            type="text"
            placeholder="Email/Username"
            name="login"
            ref={register}
          />
        ) : (
          <input type="text" placeholder="Email" name="email" ref={register} />
        )}

        <input
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
        />
        {view === "signup" && (
          <>
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              ref={register}
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              ref={register}
            />
            <input type="text" placeholder="City" name="city" ref={register} />
          </>
        )}

        <input type="submit" disabled={isLoading} />
        {isLoading && <Spinner />}
      </form>
      {inModal ? null : view === "login" ? (
        <Link to="/signup">Sign Up</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default Auth;
