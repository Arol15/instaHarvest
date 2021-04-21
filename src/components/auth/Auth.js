import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRequest, useForm, useModal } from "../../hooks/hooks";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import Spinner from "../UI/Spinner";

import { validation } from "../../form_validation/validation";
import { checkAuth } from "../../utils/localStorage";
import { updateProfile } from "../../store/profileSlice";
import { parseLocation } from "../../utils/map";

import "../map/mapboxGeocoder.css";

const Auth = ({ view, inModal, closeModal, user, afterConfirm }) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [address, setAddress] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: inModal ? true : false,
  });

  checkAuth() && !inModal && history.push("/profile");

  const onSubmit = (e) => {
    sendRequest(
      view === "login" || view === "confirm"
        ? "/api/auth/login"
        : "/api/auth/signup",
      "post",
      { ...formData }
    );
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm({}, onSubmit, validation);

  const getAddressFromGeoInput = (data) => {
    const location = parseLocation(data);
    setAddress({ ...location });
  };

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    });
    if (view === "login") {
      setFormData({ login: "", password: "" });
    } else if (view === "signup") {
      setFormData({
        email: "",
        password: "",
        confirm_pass: "",
        username: "",
        first_name: "",
        state: "",
        city: "",
        zip_code: "",
        country: "",
        lat: "",
        lon: "",
        address: "",
      });
      geocoder.addTo("#geocoder-auth");
      geocoder.setPlaceholder("Enter your location");
      geocoder.on("result", getAddressFromGeoInput);

      return () => {
        geocoder.off("result", getAddressFromGeoInput);
      };
    } else if (view === "confirm") {
      setFormData({ login: user, password: "" });
    }
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      localStorage.setItem("status", "loggedIn");
      dispatch(updateProfile({ ...data }));
      if (afterConfirm && closeModal) {
        closeModal();
        afterConfirm();
      } else if (afterConfirm) {
        afterConfirm();
      } else if (closeModal) {
        // history.push("/profile");
      } else {
        history.push("/profile");
        // closeModal()
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

  useEffect(() => {
    if (address && view === "signup") {
      setFormData({ ...formData, ...address });
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  // console.log(formData);
  return (
    <div>
      {modal}
      {isLoading && <Spinner />}
      {view === "login" && <h1>Log In</h1>}
      {view === "signup" && <h1>Sign Up</h1>}
      {view === "confirm" && <h1>Confirm identity</h1>}

      <form onSubmit={handleSubmit}>
        <div className="auth-inputs">
          {view === "login" && (
            <>
              <input
                key="1"
                type="text"
                placeholder="Email/Username"
                name="login"
                onChange={handleInputChange}
                value={formData.login || ""}
              />
              <div className="form-danger">
                {formErrors.login && formErrors.login}
              </div>
            </>
          )}

          {view === "signup" && (
            <>
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username || ""}
              />
              <div className="form-danger">
                {formErrors.username && formErrors.username}
              </div>
            </>
          )}

          {view === "signup" && (
            <>
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email || ""}
              />
              <div className="form-danger">
                {formErrors.email && formErrors.email}
              </div>
            </>
          )}

          {view === "confirm" && <p>{formData.login}</p>}
          <>
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
          </>
          {view === "signup" && (
            <>
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
              <input
                key="5"
                type="text"
                placeholder="First Name"
                name="first_name"
                onChange={handleInputChange}
                value={formData.first_name || ""}
              />
              <div className="form-danger">
                {formErrors.first_name && formErrors.first_name}
              </div>
              <div id="geocoder-auth" />
              <div className="form-danger">
                {formErrors.address && formErrors.address}
              </div>
            </>
          )}
        </div>
        <input key="8" type="submit" disabled={isLoading} />
      </form>

      {inModal ? null : view === "login" ? (
        <Link to="/signup">Sign Up</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
      <p></p>
      {view === "login" && (
        <>
          <Link onClick={closeModal} to="/reset-password">
            Forgot your password?
          </Link>
          <p></p>
        </>
      )}
    </div>
  );
};

export default Auth;
