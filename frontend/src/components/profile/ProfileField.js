import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
import { useRequest, useModal, useForm } from "../../hooks/hooks";
import Spinner from "../UI/Spinner";
import Auth from "../../components/auth/Auth";
import statesList from "../../data/states.json";
import validation from "../../form_validation/validation";
import "./Profile.css";

const ProfileFild = (props) => {
  const [editState, setEditState] = useState(false);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const [modalLogin, showModalLogin, onClose, isOpen] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const onSubmit = () => {
    sendRequest(`/api/account${props.api}`, props.method, formData, true);
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm({ [props.name]: props.value }, onSubmit, validation);

  useEffect(() => {
    if (error && errorNum !== 401) {
      props.sendMsg(error, "mdl-error");
    } else if (data && data.msg) {
      props.sendMsg(data.msg, "mdl-ok");
      props.update();
      setEditState(false);
    }
  }, [data, error]);

  useEffect(() => {
    if (errorNum === 401) {
      showModalLogin(
        <Auth
          view={"confirm"}
          inModal={true}
          closeModal={onClose}
          afterConfirm={handleSubmit}
          user={props.user}
        />
      );
    }
  }, [errorNum]);

  return (
    <>
      {modalLogin}
      {isLoading && <Spinner />}
      <b>{props.title}:</b>
      {editState ? (
        <div>
          <form onSubmit={handleSubmit}>
            {props.type === "state" ? (
              <select
                key="6"
                placeholder="State"
                name="state"
                onChange={handleInputChange}
                value={formData.state || ""}
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
            ) : (
              <>
                <input
                  placeholder={""}
                  type="text"
                  name={props.name}
                  onChange={handleInputChange}
                  value={formData[props.name] || ""}
                ></input>
                <div className="form-danger">
                  {formErrors[props.name] && formErrors[props.name]}
                </div>
              </>
            )}

            <div>
              <input type="submit" disabled={isLoading}></input>
              <button
                onClick={() => {
                  setEditState(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {props.value ? props.children : <p>Empty</p>}
          <a
            onClick={() => {
              setEditState(true);
            }}
          >
            Edit
          </a>
          {/* <button
            onClick={() => {
              setEditState(true);
            }}
          >
            Edit
          </button> */}
        </>
      )}

      <br />
    </>
  );
};

export default ProfileFild;
