import { useState, useEffect } from "react";
import { useRequest, useModal, useForm } from "../../hooks/hooks";

import Auth from "../auth/Auth";
import Spinner from "../UI/Spinner";
import { Button, ButtonLink } from "../styled/buttons";
import { FormDanger } from "../styled/form";

import { validation } from "../../form_validation/validation";
import statesList from "../../assets/data/states.json";
import "./profile.css";

const ProfileFild = (props) => {
  const [editState, setEditState] = useState(false);
  const { isLoading, data, error, errorNum, sendRequest } = useRequest();
  const { modal, showModal, closeModal } = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const onSubmit = () => {
    sendRequest(`/api/account${props.api}`, props.method, formData);
  };

  const {
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  } = useForm({ [props.name]: props.value }, onSubmit, validation);
  useEffect(() => {
    if (error && errorNum !== 403) {
      props.sendMsg(error, "error");
    } else if (data && data.msg) {
      props.sendMsg(data.msg, "ok");
      props.update();
      setEditState(false);
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (errorNum === 403) {
      showModal(
        <Auth
          view={"confirm"}
          inModal={true}
          closeModal={closeModal}
          afterConfirm={handleSubmit}
          user={props.user}
        />
      );
    }
  }, [errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {modal}
      {isLoading && <Spinner />}
      <b>{props.title}:</b>
      {editState ? (
        <div>
          <form>
            {props.name === "us_state" && (
              <>
                <select
                  key="6"
                  placeholder="State"
                  name="us_state"
                  onChange={handleInputChange}
                  value={formData.us_state || ""}
                >
                  <option key="-" value="">
                    Select state
                  </option>
                  {statesList.map((elem) => {
                    return (
                      <option key={elem.abbreviation} value={statesList.name}>
                        {elem.name}
                      </option>
                    );
                  })}
                </select>
                <FormDanger>
                  {formErrors.us_state && formErrors.us_state}
                </FormDanger>
              </>
            )}

            {props.name === "password" && (
              <div className="prf-change-pass">
                <input
                  placeholder="New password"
                  type="password"
                  name={props.name}
                  onChange={handleInputChange}
                  value={formData[props.name] || ""}
                ></input>
                <p></p>
                <input
                  placeholder="Confirm new password"
                  type="password"
                  name="confirm_pass"
                  onChange={handleInputChange}
                  value={formData.confirm_pass || ""}
                ></input>
                <FormDanger>
                  {formErrors.confirm_pass && formErrors.confirm_pass}
                </FormDanger>
              </div>
            )}

            {props.name !== "us_state" && props.name !== "password" && (
              <>
                <input
                  placeholder={""}
                  type="text"
                  name={props.name}
                  onChange={handleInputChange}
                  value={formData[props.name] || ""}
                ></input>
                <FormDanger>
                  {formErrors[props.name] && formErrors[props.name]}
                </FormDanger>
              </>
            )}

            <div>
              <Button onClick={handleSubmit} disabled={isLoading}>
                Submit
              </Button>
              <Button
                onClick={() => {
                  setEditState(false);
                  setFormData({ [props.name]: props.value });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {props.name === "password" ? (
            <p></p>
          ) : props.value ? (
            props.children
          ) : (
            <p>Empty</p>
          )}
          <ButtonLink
            onClick={() => {
              setEditState(true);
            }}
          >
            {props.name === "password" ? "Change password" : "Edit"}
          </ButtonLink>
        </>
      )}

      <br />
    </>
  );
};

export default ProfileFild;
