import { useReducer, useCallback } from "react";

const fetchReducer = (currState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        isLoading: true,
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
        isLoading: false,
        error: action.errorMessage,
      };
  }
};

const useFetch = () => {
  const [fetchState, dispatchFetch] = useReducer(fetchReducer, {
    isLoading: false,
    error: null,
    data: null,
  });

  const sendRequest = useCallback(async (url, method, body, jwtType) => {
    let headers = { "Content-Type": "application/json" };
    switch (jwtType) {
      case "ACCESS":
        headers.Authorization =
          "Bearer " + localStorage.getItem("access_token");
        break;
      case "REFRESH":
        headers.Authorization =
          "Bearer " + localStorage.getItem("refresh_token");
        break;
    }

    dispatchFetch({ type: "SEND" });
    try {
      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok && !contentType) {
        throw "Something went wrong";
      }

      const json = await res.json();

      if (!res.ok && json.error) {
        throw json.error;
      } else if (!res.ok) {
        throw "Something went wrong";
      }
      dispatchFetch({ type: "RESPONSE", responseData: json });
    } catch (error) {
      dispatchFetch({ type: "ERROR", errorMessage: error });
    }
  }, []);

  return [fetchState.isLoading, fetchState.data, fetchState.error, sendRequest];
};

export default useFetch;
