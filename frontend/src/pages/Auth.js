import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "../components/UI/Spinner";
import useModal from "../hooks/useModal";
import { v4 as uuid } from "uuid";

const Auth = ({ view, inModal, closeModal, user }) => {
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: inModal ? true : false,
  });

  const onSubmit = (formData) => {
    sendRequest(
      view === "login" || view === "confirm"
        ? "api/auth/login"
        : "api/auth/signup",
      "post",
      formData
    );
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
      {view === "login" && <h1>Loign</h1>}
      {view === "signup" && <h1>Sign Up</h1>}
      {view === "confirm" && <h1>Confrim identity</h1>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {view === "signup" && (
          <input
            key={uuid()}
            type="text"
            placeholder="Username"
            name="username"
            ref={register}
          />
        )}
        {view === "login" && (
          <input
            key={uuid()}
            type="text"
            placeholder="Email/Username"
            name="login"
            ref={register}
          />
        )}
        {view === "signup" && (
          <input
            key={uuid()}
            type="text"
            placeholder="Email"
            name="email"
            ref={register}
          />
        )}
        {view === "confirm" && (
          <input
            hidden={true}
            key={uuid()}
            type="text"
            name="login"
            defaultValue={user}
            ref={register}
          />
        )}

        <input
          key={uuid()}
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
        />
        {view === "signup" && (
          <>
            <input
              key={uuid()}
              type="text"
              placeholder="First Name"
              name="first_name"
              ref={register}
            />
            <input
              key={uuid()}
              type="text"
              placeholder="State"
              name="state"
              ref={register}
            />
            <input
              key={uuid()}
              type="text"
              placeholder="City"
              name="city"
              ref={register}
            />
          </>
        )}

        <input key={uuid()} type="submit" disabled={isLoading} />
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
