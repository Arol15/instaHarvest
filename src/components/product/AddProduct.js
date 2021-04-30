import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useRequest,
  useForm,
  useModal,
  useUploadImages,
  useAddress,
} from "../../hooks/hooks";

import AuthModal from "../auth/AuthModal";
import ToggleInput from "../UI/ToggleInput";
import Spinner from "../UI/Spinner";
import Icons from "../UI/Icons";

import { validation } from "../../form_validation/validation";
import { checkAuth } from "../../utils/localStorage";
import { showMsg } from "../../store/modalSlice";
import { createFormData } from "../../utils/images";
import { addressObjToString } from "../../utils/map";
import "../map/mapboxGeocoder.css";
import "./addProduct.css";

const AddProduct = () => {
  const history = useHistory();
  const {
    isLoading,
    data,
    error,
    errorNum,
    sendRequest,
    uploadStatus,
  } = useRequest();
  const dispatch = useDispatch();
  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
    disableClose: true,
  });
  const { addresses, address, searchAddress, setSearchAddress } = useAddress({
    id: "#geocoder-add-loc",
    placeholder: "Add new location",
  });

  const [uploadImagesContainer, filesToSend] = useUploadImages({
    multipleImages: true,
  });

  const onSubmit = () => {
    sendRequest("/api/products/add_product", "post", formData);
  };

  const {
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  } = useForm(
    {
      name: "",
      product_type: "",
      product_icon: "",
      image_urls: null,
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
      setSearchAddress(true);
    } else {
      setSearchAddress(false);
    }

    handleInputChange(event);
  };

  useEffect(() => {
    if (address.lat) {
      setFormData({ ...formData, location: { ...address } });
    } else {
      setFormData({ ...formData, location: "add" });
    }
  }, [address]);

  const onChooseIcon = (url) => {
    setFormData({ ...formData, product_icon: url });
    closeModal();
  };

  useEffect(() => {
    if (!checkAuth()) {
      showModal(<AuthModal afterConfirm={handleAfterConfirm} />);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error && error.includes("Address already exist")) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
    } else if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          classes: "mdl-error",
        })
      );
      history.push("/profile");
    } else if (data) {
      if (data.msg === "Product created" && filesToSend.length > 0) {
        dispatch(
          showMsg({
            open: true,
            msg: "Product has been added! Uploading images...",
            classes: "mdl-ok",
          })
        );

        const formDataObject = createFormData(filesToSend);
        sendRequest(
          `/api/products/update_product_images/${data.product_id}`,
          "POST",
          formDataObject,
          true
        );
      } else if (
        data.msg === "Product created" ||
        data.msg.includes("been uploaded")
      ) {
        dispatch(
          showMsg({
            open: true,
            msg: data.msg,
            classes: "mdl-ok",
          })
        );
        history.push("/profile");
      }
    }
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="add-product-main">
      {isLoading && <Spinner uploadStatus={uploadStatus} />}
      <div className="add-product">
        <h2>Share Your Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (checkAuth()) {
              handleSubmit();
            } else {
              showModal(<AuthModal afterConfirm={handleAfterConfirm} />);
            }
          }}
        >
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
            className="add-product-icon border"
            src={
              formData.product_icon
                ? formData.product_icon
                : "https://instaharvest.net/assets/images/icons/empty.png"
            }
            alt=""
          />

          <div className="form-danger">
            {formErrors.product_icon && formErrors.product_icon}
          </div>
          <label>Images:</label>
          {uploadImagesContainer}
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
                defaultValue={"select"}
              >
                <option key="select" value="">
                  Select location
                </option>
                <option key="addnew" value="add">
                  Add new location
                </option>
                {addresses.map((addr, i) => {
                  return (
                    <option key={i} value={addr.properties.id}>
                      {addr.properties.primary_address && "Primary address: "}
                      {addressObjToString(addr.properties)}
                    </option>
                  );
                })}
              </select>
              {searchAddress && <div id="geocoder-add-loc" />}
              <div className="form-danger">
                {formErrors.location && formErrors.location}
              </div>
            </>
          )}
          <p></p>
          <button>Add Product</button>
        </form>
      </div>
      {modal}
    </div>
  );
};

export default AddProduct;
