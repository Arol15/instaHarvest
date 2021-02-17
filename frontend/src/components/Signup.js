import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import useModal from "../hooks/useModal";
import Spinner from "./UI/Spinner";

const Signup = (props) => {
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const onSubmit = (formData) => {
    sendRequest("api/auth/signup", "post", formData);
  };
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: props.inModal ? true : false,
  });
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    history.push("/profile");
  }

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
      {isLoading && <Spinner />}
      <br></br>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          ref={register}
        />
        <input
          type="text"
          placeholder="First Name"
          name="first_name"
          ref={register}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="last_name"
          ref={register}
        />
        <input type="text" placeholder="Email" name="email" ref={register} />
        <input
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
        />
        <input type="text" placeholder="State" name="state" ref={register} />
        <input type="text" placeholder="City" name="city" ref={register} />
        <input
          type="text"
          placeholder="Image"
          name="image_url"
          ref={register}
        />
        <input
          type="text"
          placeholder="User Role"
          name="user_role"
          ref={register}
        />
        <input
          type="text"
          placeholder="User Role"
          name="address"
          ref={register}
        />
        <input type="text" placeholder="Longitude" name="lgt" ref={register} />
        <input type="text" placeholder="Latitude" name="lat" ref={register} />
        <input
          type="text"
          placeholder="User Role"
          name="zip_code"
          ref={register}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Signup;
