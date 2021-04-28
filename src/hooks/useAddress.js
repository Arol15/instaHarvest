import { useEffect, useState } from "react";
import { useRequest } from "./hooks";
import { useDispatch } from "react-redux";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { checkAuth } from "../utils/localStorage";
import { parseLocation } from "../utils/map";
import { showMsg } from "../store/modalSlice";

/**
 *  useAddress
 *
 * ```
 * const { searchAddress, setSearchAddress, addresses, address } = useAdress({id, placeholder});
 * ```
 */

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
  const dispatch = useDispatch();

  const onResultGeocoder = (data) => {
    setAddress(parseLocation(data));
  };

  const onClearGeocoder = () => {
    setAddress({ ...fields });
  };

  useEffect(() => {
    if (checkAuth()) {
      sendRequest("/api/account/get_user_addresses", "POST");
    }
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
    if (searchAddress) {
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
  }, [searchAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return { searchAddress, setSearchAddress, addresses, address };
};

export default useAddress;
