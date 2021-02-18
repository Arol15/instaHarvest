import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "../components/UI/Spinner";
import useModal from "../hooks/useModal";
import { v4 as uuid } from "uuid";

const Auth = ({ view, inModal, closeModal, user }) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: inModal ? true : false,
  });

  const [formData, setFormData] = useState({
    login: user,
    email: "",
    password: "",
    username: "",
    first_name: "",
    state: "",
    city: "",
  });

  // const onSubmit = (formData) => {
  //   sendRequest(
  //     view === "login" || view === "confirm"
  //       ? "api/auth/login"
  //       : "api/auth/signup",
  //     "post",
  //     formData
  //   );
  // };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    sendRequest(
      view === "login" || view === "confirm"
        ? "api/auth/login"
        : "api/auth/signup",
      "post",
      formData
    );
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token && !inModal) {
      history.push("/profile");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      if (closeModal) {
        closeModal();
      } else {
        history.push("/profile");
      }
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      showModal(error, "mdl-error");
    } else if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
    }
  }, [error, errorNum, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {modal}
      {isLoading && <Spinner />}
      {view === "login" && <h1>Login</h1>}
      {view === "signup" && <h1>Sign Up</h1>}
      {view === "confirm" && <h1>Confirm identity</h1>}

      <form onSubmit={onSubmit}>
        {view === "login" && (
          <input
            key="1"
            type="text"
            placeholder="Email/Username"
            name="login"
            onChange={onChange}
            value={formData.login}
          />
        )}

        {view === "signup" && (
          <input
            key="2"
            type="text"
            placeholder="Username"
            name="username"
            onChange={onChange}
            value={formData.signup}
          />
        )}

        {view === "signup" && (
          <input
            key="3"
            type="text"
            placeholder="Email"
            name="email"
            onChange={onChange}
            value={formData.email}
          />
        )}

        {view === "confirm" && <p>{formData.login}</p>}
        <input
          key="4"
          type="password"
          placeholder="Password"
          name="password"
          onChange={onChange}
          value={formData.password}
        />
        {view === "signup" && (
          <>
            <input
              key="5"
              type="text"
              placeholder="First Name"
              name="first_name"
              onChange={onChange}
              value={formData.first_name}
            />
            <input
              key="6"
              type="text"
              placeholder="State"
              name="state"
              onChange={onChange}
              value={formData.state}
            />
            <input
              key="7"
              type="text"
              placeholder="City"
              name="city"
              onChange={onChange}
              value={formData.city}
            />
          </>
        )}
        <input key={uuid()} type="submit" disabled={isLoading} />
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
