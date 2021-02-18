import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useRequest from "../../hooks/useRequest";
import useModal from "../../hooks/useModal";
import Spinner from "../../components/UI/Spinner";
import Auth from "../Auth";
import "./Profile.css";

const ProfileFild = (props) => {
  const [editState, setEditState] = useState(false);
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const { register, handleSubmit } = useForm();
  const [modalLogin, showModalLogin, onClose] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const onSubmit = (formData) => {
    sendRequest(`api/account${props.api}`, props.method, formData, true);
    setEditState(false);
  };

  useEffect(() => {
    if (errorNum === 401) {
      showModalLogin(
        <Auth
          view={"confirm"}
          inModal={true}
          closeModal={onClose}
          user={props.user}
        />
      );
    } else if (error) {
      props.sendMsg(error, "mdl-error");
    } else if (data && data.msg) {
      props.sendMsg(data.msg, "mdl-ok");
      props.update();
    }
  }, [data, error, errorNum]);

  return (
    <div className="prf-field">
      {modalLogin}
      {isLoading && <Spinner />}
      <b>{props.title}:</b>
      {editState ? (
        <p>
          {props.prefix}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              defaultValue={props.children && props.children}
              placeholder={props.children ? "" : "empty"}
              type="text"
              name={props.name}
              ref={register}
            ></input>

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
        </p>
      ) : (
        <>
          <p>
            {props.prefix && props.prefix}
            {props.children ? props.children : "Empty"}
          </p>
          <button
            onClick={() => {
              setEditState(true);
            }}
          >
            Edit
          </button>
        </>
      )}

      <br />
    </div>
  );
};

export default ProfileFild;
