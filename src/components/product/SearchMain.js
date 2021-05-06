import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, useRequest } from "../../hooks/hooks";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import Spinner from "../UI/Spinner";
import { Button } from "../styled/buttons";

import { MdMyLocation } from "react-icons/md";
import { validation } from "../../form_validation/validation";
import { showMsg } from "../../store/modalSlice";
import { updateProducts, updateLocation } from "../../store/productsSlice";
import { parseLocation, getBrowserLocation } from "../../utils/utils";

import "../map/mapboxGeocoder.css";

const SearchMain = () => {
  const [geocoder] = useState(
    new MapboxGeocoder({
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
    })
  );

  const { isLoading, data, error, sendRequest } = useRequest();
  const dispatch = useDispatch();

  const history = useHistory();

  const onSubmit = () => {
    sendRequest("/api/products/get_products", "POST", formData);
  };

  const {
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  } = useForm({ lat: "", lon: "", range: 20 }, onSubmit, validation);

  const onResultGeocoder = (data) => {
    const location = parseLocation(data);
    setFormData({ ...formData, lat: location.lat, lon: location.lon });
  };

  const onClearGeocoder = () => {
    setFormData({ ...formData, lat: "", lon: "" });
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
        type: "error",
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
        const coord = data.products[0].geometry.coordinates;
        dispatch(updateLocation({ lon: coord[0], lat: coord[1] }));
        history.push("/search-results");
      } else {
        dispatch(
          showMsg({
            open: true,
            msg: `No results per this location and in range of ${formData.range} mi`,
            type: "error",
          })
        );
      }
    } else if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  // console.log(formData);
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
      <div className="flexbox-row prd-search-range">
        <div>Range: </div>
        <form>
          <input
            type="number"
            name="range"
            min="0"
            max="3000"
            step="5"
            onChange={handleInputChange}
            value={formData.range || ""}
          ></input>
        </form>
        <div> mi</div>
      </div>
      <div className="form-danger">{formErrors.range && formErrors.range}</div>

      <Button style={{ marginTop: "20px" }} onClick={handleSubmit}>
        Find
      </Button>
    </>
  );
};

export default SearchMain;
