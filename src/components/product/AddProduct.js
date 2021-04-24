import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRequest, useForm, useModal } from "../../hooks/hooks";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import AuthModal from "../auth/AuthModal";
import ToggleInput from "../UI/ToggleInput";
import Spinner from "../UI/Spinner";
import Icons from "../UI/Icons";
import UploadImage from "../UI/UploadImage";

import { validation } from "../../form_validation/validation";
import { parseLocation } from "../../utils/map";
import { checkAuth } from "../../utils/localStorage";
import { showMsg } from "../../store/modalSlice";

import "../map/mapboxGeocoder.css";
import "./addProduct.css";

const AddProduct = () => {
  const history = useHistory();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState();
  const [newAddress, setNewAddress] = useState(false);
  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
    disableClose: true,
  });

  const onSubmit = () => {
    sendRequest("/api/products/add_product", "post", formData);
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm(
    {
      name: "",
      product_type: "",
      product_icon: "",
      image_urls: [],
      price: 0,
      status: "",
      description: "",
      location: "",
      new_addr: "",
    },
    onSubmit,
    validation
  );

  const handleAfterConfirm = () => {
    closeModal();
    window.location.reload();
  };

  const handleInputChangeLocation = (event) => {
    if (event.target.value === "add") {
      setNewAddress(true);
    } else {
      setNewAddress(false);
    }

    handleInputChange(event);
  };

  const onResultGeocoder = (data) => {
    const addressFields = {
      state: "",
      city: "",
      zip_code: "",
      country: "",
      lat: "",
      lon: "",
      address: "",
    };
    const location = parseLocation(data);
    setFormData({ ...formData, location: { ...addressFields, ...location } });
  };

  const onClearGeocoder = () => {
    setFormData({ ...formData, location: "add" });
  };

  const onChooseIcon = (url) => {
    setFormData({ ...formData, product_icon: url });
    closeModal();
  };

  useEffect(() => {
    if (!checkAuth()) {
      showModal(<AuthModal afterConfirm={handleAfterConfirm} />);
    } else {
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
      if (data.msg === "addresses") {
        setAddresses(data.list);
      } else {
        dispatch(
          showMsg({
            open: true,
            msg: "Product has been added!",
            classes: "mdl-ok",
          })
        );
        history.push("/user-products");
      }
    }
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (newAddress) {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      });
      geocoder.addTo("#geocoder-add-loc");
      geocoder.setPlaceholder("Enter new location");
      geocoder.on("result", onResultGeocoder);
      geocoder.on("clear", onClearGeocoder);

      return () => {
        geocoder.off("result", onResultGeocoder);
        geocoder.off("clear", onClearGeocoder);
      };
    }
  }, [newAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner />}
      <div className="add-product">
        <h2>Share Your Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Name of your product:</label>
          <input
            className="add-product-input"
            placeholder="Name"
            type="text"
            name="name"
            onChange={handleInputChange}
            value={formData.name || ""}
          />
          <div className="form-danger">
            {formErrors.name && formErrors.name}
          </div>
          <label>Product Type:</label>
          <select
            name="product_type"
            onChange={handleInputChange}
            value={formData.product_type || ""}
          >
            <option>Select Product Type</option>
            <option>Fruit</option>
            <option>Vegetable</option>
            <option>Herb</option>
            <option>Other</option>
          </select>
          <div className="form-danger">
            {formErrors.product_type && formErrors.product_type}
          </div>
          <label>Icon:</label>
          <img
            onClick={() => {
              showModal(<Icons onClick={onChooseIcon} />);
            }}
            className="add-product-icon"
            src={
              formData.product_icon
                ? formData.product_icon
                : "https://instaharvest.net/assets/images/icons/empty.png"
            }
            alt=""
          />

          <p />
          <button
            onClick={(e) => {
              e.preventDefault();
              showModal(<Icons onClick={onChooseIcon} />);
            }}
          >
            Choose icon
          </button>
          <div className="form-danger">
            {formErrors.product_icon && formErrors.product_icon}
          </div>
          <label>Picture:</label>
          <button className="button-link" onClick={() => {}}>
            Upload Pictures
          </button>
          <label>Price: </label>
          <ToggleInput
            name="price"
            handleInputChange={handleInputChange}
            inputValue={formData.price || ""}
            setFormData={setFormData}
            formData={formData}
          />
          <label>Description: </label>
          <textarea
            rows={3}
            placeholder="Describe your product"
            type="textarea"
            name="description"
            onChange={handleInputChange}
            value={formData.description || ""}
          />
          <div className="form-danger">
            {formErrors.description && formErrors.description}
          </div>
          <label>Location: </label>
          {addresses && (
            <>
              <select
                name="location"
                onChange={handleInputChangeLocation}
                value={formData.location || ""}
              >
                <option value="">Select location</option>
                {addresses.map((addr, i) => {
                  return (
                    <option key={i} value={addr.properties.id}>
                      {addr.properties.primary_address && "Primary address: "}
                      {addr.properties.address &&
                        `${addr.properties.address}, `}
                      {addr.properties.city && `${addr.properties.city}, `}
                      {addr.properties.us_state &&
                        `${addr.properties.us_state}, `}
                      {addr.properties.country && `${addr.properties.country}`}
                    </option>
                  );
                })}
                <option value="add">Add new location</option>
              </select>
              {newAddress && <div id="geocoder-add-loc" />}
              <div className="form-danger">
                {formErrors.location && formErrors.location}
              </div>
            </>
          )}
          <button>Add Product</button>
        </form>
      </div>
      {modal}
    </>
  );
};

export default AddProduct;
