import { useEffect } from "react";
import { useRequest, useModal, useForm } from "../hooks/hooks";
import formValidation from "../form_validation/validateAuth";
import { useHistory } from "react-router-dom";
import Spinner from "../components/UI/Spinner";

const ResetPassword = (props) => {
  const history = useHistory();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    timeOut: 7000,
    inPlace: false,
  });
  console.log(props);
  const onSubmit = () => {
    if (props.match.params.token) {
      sendRequest("/api/auth/reset_password_confirm", "POST", {
        password: formData.password,
        token: props.match.params.token,
      });
    } else {
      sendRequest("/api/auth/reset_password", "POST", {
        email: formData.email,
      });
    }
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm(
    props.match.params.token
      ? { password: "", confirm_pass: "" }
      : { email: "" },
    onSubmit,
    formValidation
  );

  useEffect(() => {
    if (error) {
      showModal(error, "mdl-error");
    } else if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
      if (props.match.params.token) {
        history.push("/login");
      } else {
      }
    }
  }, [error, errorNum, data]);

  return (
    <>
      {modal}
      {isLoading && <Spinner />}
      <h1>Reset Password</h1>
      {props.match.params.token ? (
        <>
          <form onSubmit={handleSubmit}>
            <label>New password: </label>
            <input
              key="4"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password || ""}
            />
            <div className="form-danger">
              {formErrors.password && formErrors.password}
            </div>

            <label>Confirm password: </label>
            <input
              key="15"
              type="password"
              placeholder="Confirm password"
              name="confirm_pass"
              onChange={handleInputChange}
              value={formData.confirm_pass || ""}
            />
            <div className="form-danger">
              {formErrors.confirm_pass && formErrors.confirm_pass}
            </div>
            <input key="87" type="submit" disabled={isLoading} />
          </form>
        </>
      ) : (
        <>
          <p>Enter your email address below</p>
          <form onSubmit={handleSubmit}>
            <label>Email: </label>
            <input
              key="9"
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email || ""}
            />
            <div className="form-danger">
              {formErrors.email && formErrors.email}
            </div>
            <input key="8" type="submit" disabled={isLoading} />
          </form>
        </>
      )}
    </>
  );
};

export default ResetPassword;
