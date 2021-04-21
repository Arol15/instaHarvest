import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, useRequest } from "../../hooks/hooks";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import Spinner from "../UI/Spinner";

import { MdMyLocation } from "react-icons/md";
import { validation } from "../../form_validation/validation";
import { showMsg } from "../../store/modalSlice";
import { updateProducts, updateLocation } from "../../store/productsSlice";
import { parseLocation, getBrowserLocation } from "../../utils/map";

import "../map/mapboxGeocoder.css";

const SearchMain = () => {
  const [geocoder] = useState(
    new MapboxGeocoder({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    })
  );

  const [isLoading, data, error, , sendRequest] = useRequest();
  const dispatch = useDispatch();

  const history = useHistory();

  const onSubmit = () => {
    sendRequest("/api/products/get_local_products", "POST", formData);
  };

  const [setFormData, handleSubmit, , formData, formErrors] = useForm(
    { lat: "", lon: "" },
    onSubmit,
    validation
  );

  const onResultGeocoder = (data) => {
    const location = parseLocation(data);
    setFormData({ lat: location.lat, lon: location.lon });
  };

  const onClearGeocoder = () => {
    setFormData({ lat: "", lon: "" });
  };

  const successFn = (pos) => {
    const crd = pos.coords;
    sendRequest(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${crd.longitude},${crd.latitude}.json?limit=1&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
    );
  };

  const errorFn = (err) => {
    dispatch(
      showMsg({
        open: true,
        msg: err.message,
        classes: "mdl-error",
      })
    );
  };

  useEffect(() => {
    geocoder.addTo("#geocoder-main");
    geocoder.setPlaceholder("Enter your location");
    geocoder.on("result", onResultGeocoder);
    geocoder.on("clear", onClearGeocoder);

    return () => {
      geocoder.off("result", onResultGeocoder);
      geocoder.off("clear", onClearGeocoder);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      if (data.type && data.type === "FeatureCollection") {
        geocoder.setInput(data.features[0].place_name);
      } else if (data.products.length > 0) {
        dispatch(updateProducts(data.products));
        dispatch(updateLocation(formData));
        history.push("/search-results");
      } else {
        dispatch(
          showMsg({
            open: true,
            msg: "No results per this location",
            classes: "mdl-error",
          })
        );
      }
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

  return (
    <>
      {isLoading && <Spinner />}
      <div className="search-container">
        <div id="geocoder-main" />
        <div
          className="geocoder-find-location"
          onClick={() => getBrowserLocation(successFn, errorFn)}
        >
          <MdMyLocation size="30px" />
        </div>
      </div>
      <div className="form-danger">
        {formErrors.address && formErrors.address}
      </div>

      <button onClick={handleSubmit}>Find</button>
    </>
  );
};

export default SearchMain;
