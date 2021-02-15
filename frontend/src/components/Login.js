import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "./UI/Spinner";
import Error from "./UI/Error";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const onSubmit = (formData) => {
    sendRequest("api/auth/login", "post", formData);
  };

  const handleClick = () => {
    history.push("/signup");
  };

  useEffect(() => {
    if (data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      history.push("/profile");
    }
  }, [data]);

  return (
    <>
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
        {!isLoading ? <input type="submit" /> : <Spinner inPlace={true} />}
      </form>
      {error ? <Error errorMsg={error} /> : <div></div>}
      <Link to="/signup">Sign Up</Link>
    </>
  );
};

export default Login;
