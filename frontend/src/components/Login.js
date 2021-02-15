import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "./UI/Spinner";
import MsgModal from "./UI/MsgModal";

const Login = (props) => {
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
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

  return (
    <div>
      <h1>Login</h1>
      {error ? <MsgModal styles={["error"]}>{error}</MsgModal> : <div></div>}

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
        {isLoading && <Spinner inPlace={false} />}
      </form>

      {props.inModal ? null : <Link to="/signup">Sign Up</Link>}
    </div>
  );
};

export default Login;
