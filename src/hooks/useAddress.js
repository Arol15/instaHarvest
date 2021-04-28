import { useEffect, useState } from "react";
import { useRequest } from "../../hooks/hooks";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { parseLocation } from "../../utils/map";
import { showMsg } from "../../store/modalSlice";

import "../map/mapboxGeocoder.css";
import "./addProduct.css";

const useAddress = ({ id, placeholder }) => {
  const fields = {
    state: "",
    city: "",
    zip_code: "",
    country: "",
    lat: "",
    lon: "",
    address: "",
  };

  const { data, error, sendRequest } = useRequest();
  const [addresses, setAddresses] = useState();
  const [address, setAddress] = useState({ ...fields });
  const [searchAddress, setSearchAddress] = useState(false);

  const onResultGeocoder = (data) => {
    setAddress(parseLocation(data));
  };

  const onClearGeocoder = () => {
    setAddress({ ...fields });
  };

  useEffect(() => {
    sendRequest("/api/account/get_user_addresses", "POST");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    } else if (data) {
      setAddresses(data.list);
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (newAddress) {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      });
      geocoder.addTo(id);
      geocoder.setPlaceholder(placeholder ? placeholder : null);
      geocoder.on("result", onResultGeocoder);
      geocoder.on("clear", onClearGeocoder);

      return () => {
        geocoder.off("result", onResultGeocoder);
        geocoder.off("clear", onClearGeocoder);
      };
    }
  }, [newAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return { searchAddress, setSearchAddress, addresses, address };
};

export default useAddress;
