import { useReducer, useCallback } from "react";

const fetchReducer = (currState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
      };
    case "RESPONSE":
      return {
        ...currState,
        loading: false,
        data: action.responseData,
      };
    case "ERROR":
      return {
        loading: false,
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

  const sendRequest = useCallback((url, method, body) => {
    dispatchFetch({ type: "SEND" });
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok && !contentType) {
          throw "Something went wrong";
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.error) {
          throw resData.error;
        }
        console.log(resData);
        dispatchFetch({ type: "RESPONSE", responseData: resData });
      })
      .catch((error) => {
        dispatchFetch({ type: "ERROR", errorMessage: error });
      });
  }, []);

  return [fetchState.isLoading, fetchState.data, fetchState.error, sendRequest];
};

export default useFetch;
