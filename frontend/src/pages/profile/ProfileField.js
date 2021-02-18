import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useRequest from "../../hooks/useRequest";
import useModal from "../../hooks/useModal";
import Spinner from "../../components/UI/Spinner";
import Auth from "../Auth";
import "./Profile.css";

const ProfileFild = (props) => {
  const [editState, setEditState] = useState(false);
  // const [savedFormData, setFormData] = useState({
  //   formData: false,
  //   resend: false,
  // });
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const { register, handleSubmit } = useForm();
  const [modalLogin, showModalLogin, onClose, isOpen] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  const onSubmit = (formData) => {
    console.log(formData);
    sendRequest(`api/account${props.api}`, props.method, formData, true);
  };

  useEffect(() => {
    if (error && !errorNum) {
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
          afterConfirm={handleSubmit(onSubmit)}
          user={props.user}
        />
      );
    }
  }, [errorNum]);

  return (
    <div className="prf-field">
      {modalLogin}
      {isLoading && <Spinner />}
      <b>{props.title}:</b>
      {editState ? (
        <div>
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
        </div>
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
