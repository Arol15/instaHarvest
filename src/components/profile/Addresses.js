import { useEffect, useState } from "react";
import { useRequest, useAddress, useModal } from "../../hooks/hooks";
import { useDispatch } from "react-redux";

import { FiX, FiCheck } from "react-icons/fi";
import Tooltip from "../UI/Tooltip";
import Spinner from "../UI/Spinner";

import { showMsg } from "../../store/modalSlice";
import { addressObjToString } from "../../utils/map";
import "./profile.css";
import "../map/mapboxGeocoder.css";

const Addresses = () => {
  const [requestData, setRequestData] = useState(null);
  const {
    addresses,
    address,
    searchAddress,
    setSearchAddress,
    updateAddresses,
  } = useAddress({
    id: "#addresses-loc",
    placeholder: "Add new address",
  });

  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
    disableClose: true,
  });

  const dispatch = useDispatch();
  const { isLoading, data, error, sendRequest } = useRequest();

  const onClickDelete = (isPrim, addressId) => {
    if (isPrim) {
      dispatch(
        showMsg({
          open: true,
          msg:
            "You can not delete the primary address. Change the primary address first",
          classes: "mdl-error",
        })
      );
    } else {
      showModal(
        <>
          <h3>Are you sure to delete?</h3>
          <button
            onClick={() => {
              closeModal();
              sendRequest("/api/account/edit_user_address", "DELETE", {
                address_id: addressId,
              });
            }}
          >
            Yes
          </button>
          <button onClick={closeModal}>No</button>
        </>
      );
    }
  };

  const onClickSubmit = () => {
    if (!requestData.lon) {
      dispatch(
        showMsg({
          open: true,
          msg: "Choose location",
          classes: "mdl-error",
        })
      );
    } else {
      sendRequest("/api/account/edit_user_address", "POST", requestData);
    }
  };

  const onClickMakePrimary = (isPrim, addressId) => {
    if (!isPrim) {
      sendRequest("/api/account/edit_user_address", "PATCH", {
        address_id: addressId,
      });
    }
  };

  useEffect(() => {
    if (data) {
      dispatch(
        showMsg({
          open: true,
          msg: data.msg,
          classes: "mdl-ok",
        })
      );
      if (data.address_id) {
        setSearchAddress(false);
      }
      updateAddresses();
    } else if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRequestData({ ...requestData, ...address });
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      {modal}
      {addresses &&
        addresses.map((addr, ind) => {
          const isPrimary = addr.properties.primary_address;
          return (
            <div key={ind} className="prf-addresses">
              <div className="prf-address-flexbox">
                <div>{addressObjToString(addr.properties)}</div>
                <div>
                  <Tooltip text={isPrimary ? "" : "Delete"}>
                    <FiX
                      onClick={() =>
                        onClickDelete(isPrimary, addr.properties.id)
                      }
                      color={isPrimary ? "#7575756b" : "red"}
                      size="34px"
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                </div>
                <div>
                  <Tooltip
                    text={
                      isPrimary ? "Primary address" : "Make primary address"
                    }
                  >
                    <FiCheck
                      onClick={() =>
                        onClickMakePrimary(isPrimary, addr.properties.id)
                      }
                      color={isPrimary ? "#00ac00" : "#7575756b"}
                      size="34px"
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                </div>
              </div>
              <hr />
            </div>
          );
        })}

      {address && (
        <div className="prf-addresses-add-address">
          {!searchAddress ? (
            <button
              onClick={() => {
                setSearchAddress(true);
              }}
              className="button-link"
              style={{ fontSize: "1.1rem" }}
            >
              Add address
            </button>
          ) : (
            <>
              <p>Add address:</p>
              <div className="prf-addresses-add-field" id="addresses-loc" />
              <button onClick={onClickSubmit}>Submit</button>
              <button
                onClick={() => {
                  setSearchAddress(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Addresses;
