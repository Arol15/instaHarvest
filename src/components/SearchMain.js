import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useForm from "../hooks/useForm";
import useRequest from "../hooks/useRequest";
import validation from "../form_validation/validation";
import { checkAuth } from "../utils/localStorage";
import { useDispatch } from "react-redux";
import { showMsg } from "../store/modalSlice";
import Spinner from "./UI/Spinner";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "../mapboxGeocoder.css";

const SearchMain = () => {
  const onSubmit = () => {
    if (checkAuth()) {
      sendRequest("/api/products/get-all-protected", "post", formData);
    } else {
      sendRequest("/api/products/get-all", "post", formData);
    }
  };

  const [searchState, setSearchState] = useState({ error: null });

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm({ search_term: "" }, onSubmit, validation);

  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    });
    geocoder.addTo("#geocoder-container");
    geocoder.setPlaceholder("Enter your location");
    geocoder.on("result", (res) => {
      console.log(res);
    });

    return () => {
      geocoder.off("result", () => {});
    };
  }, []);

  useEffect(() => {
    if (data && data.products.length === 0) {
      dispatch(
        showMsg({
          open: true,
          msg: "No results per this location",
          classes: "mdl-error",
        })
      );
    } else if (data) {
      history.push({
        pathname: "/search-results",
        state: data,
      });
    } else if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    }
  }, [data, error]);

  return (
    <>
      {isLoading && <Spinner />}
      <div id="geocoder-container" />
      {searchState.error && (
        <div className="form-danger">{searchState.error}</div>
      )}
      <button onClick={handleSubmit}>Find</button>
    </>
  );
};

export default SearchMain;
