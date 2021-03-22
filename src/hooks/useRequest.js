import axios from "axios";
import { useReducer, useCallback, useDebugValue } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../utils/localStorage";

const fetchReducer = (currState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        ...currState,
        isLoading: true,
        errorNum: null,
        error: null,
        data: null,
      };
    case "RESPONSE":
      return {
        isLoading: false,
        data: action.responseData,
        errorNum: null,
        error: null,
      };
    case "ERROR":
      return {
        data: null,
        isLoading: false,
        error: action.errorMessage,
        errorNum: action.errorNum,
      };
    case "LOGOUT":
      return {
        isLoading: false,
        errorNum: null,
        error: null,
        data: null,
      };
    default:
      return;
  }
};

/**
 *  useRequest
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useRequest
 */

const useRequest = () => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    isLoading: false,
    error: null,
    errorNum: null,
    data: null,
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const sendRequest = useCallback(async (url, method, body) => {
    dispatchFetch({
      type: "SEND",
    });

    const config = {
      method: method,
      url: url,
      data: body,
      timeout: 5000,
    };

    let resp = await axios(config).then(
      (res) => res,
      (err) => err.response
    );
    if (!resp) {
      dispatchFetch({
        type: "ERROR",
        errorMessage: "Something went wrong",
        errorNum: 500,
      });
      return;
    }

    if (resp.status === 401 && resp.data.error === "unauthorized") {
      logout()
        .then(() => {
          dispatchFetch({
            type: "LOGOUT",
          });
          history.push("/login");
        })
        .catch((error) => {
          dispatchFetch({
            type: "ERROR",
            errorMessage: resp.data.error,
            errorNum: resp.status,
          });
        });
    }
    if (resp.status >= 200 && resp.status < 300) {
      dispatchFetch({
        type: "RESPONSE",
        responseData: resp.data,
      });
    } else if (resp.data.error) {
      dispatchFetch({
        type: "ERROR",
        errorMessage: resp.data.error,
        errorNum: resp.status,
      });
    } else if (resp.status === 401) {
      dispatchFetch({
        type: "ERROR",
        errorMessage: "Authorization denied. Please sign in or sign up",
        errorNum: 401,
      });
    } else if (resp.status === 403) {
      dispatchFetch({
        type: "ERROR",
        errorMessage: "Not enough privileges",
        errorNum: 403,
      });
    } else {
      dispatchFetch({
        type: "ERROR",
        errorMessage: "Something went wrong",
        errorNum: resp.status,
      });
    }
  }, []);

  return [
    fetchState.isLoading,
    fetchState.data,
    fetchState.error,
    fetchState.errorNum,
    sendRequest,
  ];
};

export default useRequest;
