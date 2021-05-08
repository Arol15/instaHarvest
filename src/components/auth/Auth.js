import { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRequest, useForm, useModal } from "../../hooks/hooks";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import Spinner from "../UI/Spinner";
import {
  FormDanger,
  Button,
  ContainerWithForm,
  FlexColumn,
} from "../styled/styled";

import { validation } from "../../form_validation/validation";
import { checkAuth, parseLocation } from "../../utils/utils";
import { updateProfile } from "../../store/profileSlice";

import "../map/mapboxGeocoder.css";
import styled from "styled-components";

const AuthContainerWithForm = styled(ContainerWithForm)`
  ${Button} {
    margin: 20px;
  }
`;

const Auth = ({ view, inModal, closeModal, user, afterConfirm }) => {
  const { isLoading, data, error, errorNum, sendRequest } = useRequest();
  const [address, setAddress] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const { modal, showModal } = useModal({
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

  const {
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  } = useForm({}, onSubmit, validation);

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
      showModal(error, "error");
    } else if (data && data.msg) {
      showModal(data.msg, "ok");
    }
  }, [error, errorNum, data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (address && view === "signup") {
      setFormData({ ...formData, ...address });
    }
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  // console.log(formData);
  return (
    <AuthContainerWithForm>
      {modal}
      {isLoading && <Spinner />}
      {view === "login" && <h1>Log In</h1>}
      {view === "signup" && <h1>Sign Up</h1>}
      {view === "confirm" && <h1>Confirm identity</h1>}

      <form>
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
              <FormDanger>{formErrors.login && formErrors.login}</FormDanger>
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
              <FormDanger>
                {formErrors.username && formErrors.username}
              </FormDanger>
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
              <FormDanger>{formErrors.email && formErrors.email}</FormDanger>
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
            <FormDanger>
              {formErrors.password && formErrors.password}
            </FormDanger>
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
              <FormDanger>
                {formErrors.confirm_pass && formErrors.confirm_pass}
              </FormDanger>
              <input
                key="5"
                type="text"
                placeholder="First Name"
                name="first_name"
                onChange={handleInputChange}
                value={formData.first_name || ""}
              />
              <FormDanger>
                {formErrors.first_name && formErrors.first_name}
              </FormDanger>
              <div id="geocoder-auth" />
              <FormDanger>
                {formErrors.address && formErrors.address}
              </FormDanger>
            </>
          )}
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          Submit
        </Button>
      </form>
      <FlexColumn>
        {inModal ? null : view === "login" ? (
          <Link to="/signup">Sign Up</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
        {view === "login" && (
          <>
            <Link onClick={closeModal} to="/reset-password">
              Forgot your password?
            </Link>
          </>
        )}
      </FlexColumn>
    </AuthContainerWithForm>
  );
};

export default Auth;
