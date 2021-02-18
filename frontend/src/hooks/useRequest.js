import axios from "axios";
import { useReducer, useCallback } from "react";
import { useHistory } from "react-router-dom";

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
        ...currState,
        isLoading: false,
        data: action.responseData,
      };
    case "ERROR":
      return {
        ...currState,
        isLoading: false,
        error: action.errorMessage,
        errorNum: action.errorNum,
      };
    default:
      return;
  }
};

const useRequest = () => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    isLoading: false,
    error: null,
    errorNum: null,
    data: null,
  });

  const history = useHistory();

  const sendRequest = useCallback(async (url, method, body, isJwt = false) => {
    if (isJwt) {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (!accessToken && !refreshToken) {
        history.push("/login");
        return;
      }
    }

    let headers = {};
    if (isJwt) {
      headers.Authorization = "Bearer " + localStorage.getItem("access_token");
    }

    dispatchFetch({ type: "SEND" });

    const config = {
      method: method,
      url: url,
      data: body,
      headers: headers,
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
        errorNum: null,
      });
      return;
    }

    if (isJwt && resp.status === 401) {
      console.log("useRequest: refresh_token");
      const refrResp = await axios({
        method: "post",
        url: "api/auth/refresh",
        data: {},
        timeout: 5000,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
        },
      }).then(
        (res) => res,
        (err) => err.response
      );

      if (!refrResp) {
        dispatchFetch({
          type: "ERROR",
          errorMessage: "Something went wrong",
          errorNum: null,
        });
        return;
      }

      if (refrResp.status >= 200 && refrResp.status < 300) {
        localStorage.setItem("access_token", refrResp.data.access_token);

        const newConfig = {
          ...config,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        resp = await axios(newConfig).then(
          (res) => res,
          (err) => err.response
        );
        if (!resp) {
          dispatchFetch({
            type: "ERROR",
            errorMessage: "Something went wrong",
            errorNum: null,
          });
          return;
        }
      } else {
        resp = refrResp;
      }
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
