import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useFetch from "../hooks/fetch";

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const [isLoading, data, error, sendRequest] = useFetch();
  const onSubmit = (formData) => {
    sendRequest("api/auth/signup", "POST", JSON.stringify(formData));
  };

  useEffect(() => {
    if (data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    }
  }, [data]);

  return (
    <div>
      {error && <h1>Error: {error}</h1>}

      {isLoading && <h1>Is Loading</h1>}
      {data && <h1>User registered</h1>}
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
