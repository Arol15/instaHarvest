import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "./UI/Spinner";
import useModal from "../hooks/useModal";

const Login = (props) => {
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: props.inModal ? true : false,
  });
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    history.push("/profile");
  }

  const onSubmit = (formData) => {
    sendRequest("api/auth/login", "post", formData);
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
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Email/Username"
          name="login"
          ref={register}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
        />
        <input type="submit" disabled={isLoading} />
        {isLoading && <Spinner />}
      </form>
      {props.inModal ? null : <Link to="/signup">Sign Up</Link>}
    </div>
  );
};

export default Login;
