import { useReducer, useCallback } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import { logout } from "../utils/utils";

const fetchReducer = (currState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        ...currState,
        isLoading: true,
        errorNum: null,
        error: null,
        data: null,
        upload_status: null,
      };
    case "RESPONSE":
      return {
        isLoading: false,
        data: action.responseData,
        errorNum: null,
        error: null,
        upload_status: null,
      };
    case "ERROR":
      return {
        data: null,
        isLoading: false,
        error: action.errorMessage,
        errorNum: action.errorNum,
        upload_status: null,
      };
    case "LOGOUT":
      return {
        isLoading: false,
        errorNum: null,
        error: null,
        data: null,
        upload_status: null,
      };
    case "UPLOAD":
      return {
        ...currState,
        uploadStatus: action.uploadStatus,
      };
    default:
      return;
  }
};

/**
 *  useRequest
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useRequest
 *
 * ```
 * const {isLoading, data, error, errorNum, sendRequest, uploadStatus} = useRequest();
 * ```
 *
 * ```
 * sendRequest(url, method, body, upload);
 * ```
 */

const useRequest = () => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    isLoading: false,
    error: null,
    errorNum: null,
    data: null,
  });

  const history = useHistory();

  const sendRequest = useCallback(async (url, method, body, upload) => {
    dispatchFetch({
      type: "SEND",
    });

    const config = {
      method: method,
      url: url,
      data: body,
      timeout: upload ? null : 20000,
      onUploadProgress: (data) => {
        const percent = Math.round((100 * data.loaded) / data.total);
        if (percent > 0 && percent < 100) {
          dispatchFetch({
            type: "UPLOAD",
            uploadStatus: percent,
          });
        }
      },
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    sendRequest,
    isLoading: fetchState.isLoading,
    data: fetchState.data,
    error: fetchState.error,
    errorNum: fetchState.errorNum,
    uploadStatus: fetchState.uploadStatus,
  };
};

export default useRequest;
