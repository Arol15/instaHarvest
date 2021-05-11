import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { Button, FormDanger, ContainerWithForm } from "../styled/styled";

import { validation } from "../../form_validation/validation";
import { selectCurrentProduct } from "../../store/productsSlice";
import {
  checkAuth,
  createFormData,
  addressObjToString,
} from "../../utils/utils";
import { showMsg } from "../../store/modalSlice";
import "../map/mapboxGeocoder.css";
import styled from "styled-components/macro";

const Icon = styled.img`
    width: 50px;
    height: 50px;
    cursor: pointer;
    border-radius: 10px;
    padding: 5px;
    border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.borderColor};
  }
`;

const AddEditProduct = ({ editProduct }) => {
  const history = useHistory();
  const params = useParams();
  const { isLoading, data, error, errorNum, sendRequest, uploadStatus } =
    useRequest();
  const dispatch = useDispatch();
  const { modal, showModal, closeModal } = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
    disableClose: true,
  });
  const { addresses, address, searchAddress, setSearchAddress } = useAddress({
    id: "#geocoder-add-loc",
    placeholder: "Add new location",
  });

  const product = useSelector(selectCurrentProduct);

  const [uploadImagesContainer, filesToSend] = useUploadImages({
    multipleImages: true,
  });

  const onSubmit = () => {
    if (editProduct) {
      console.log("EDIT RERQUEST");
    } else {
      sendRequest("/api/products/add_product", "post", formData);
    }
  };

  const { setFormData, handleSubmit, handleInputChange, formData, formErrors } =
    useForm(
      editProduct && product
        ? { ...product.properties }
        : {
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
    if (editProduct) {
      if (
        !product ||
        !product.properties ||
        params.productId != product.properties.product_id ||
        !product.properties.personal
      ) {
        history.push("/profile");
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error && error.includes("Address already exist")) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    } else if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
      history.push("/profile");
    } else if (data) {
      if (data.msg === "Product created" && filesToSend.length > 0) {
        dispatch(
          showMsg({
            open: true,
            msg: "Product has been added! Uploading images...",
            type: "ok",
          })
        );

        const formDataObject = createFormData(filesToSend);
        sendRequest(
          `/api/products/edit_product_images/${data.product_id}`,
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
            type: "ok",
          })
        );
        if (data.msg === "Product information has been updated") {
          history.goBack();
        } else {
          history.push("/profile");
        }
      }
    }
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {isLoading && <Spinner uploadStatus={uploadStatus} />}
      <ContainerWithForm>
        <h2>{editProduct ? "Edit product" : "Share Your Product"}</h2>

        {editProduct && (
          <Button
            onClick={() => {
              history.goBack();
            }}
          >
            Return
          </Button>
        )}

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
            placeholder="Name"
            type="text"
            name="name"
            onChange={handleInputChange}
            value={formData.name || ""}
          />
          <FormDanger>{formErrors.name && formErrors.name}</FormDanger>
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
          <FormDanger>
            {formErrors.product_type && formErrors.product_type}
          </FormDanger>
          <label>Icon:</label>

          <Icon
            onClick={() => {
              showModal(<Icons onClick={onChooseIcon} />);
            }}
            src={
              formData.product_icon
                ? formData.product_icon
                : "https://instaharvest.net/assets/images/icons/empty.png"
            }
            alt=""
          />

          <FormDanger>
            {formErrors.product_icon && formErrors.product_icon}
          </FormDanger>

          {!editProduct && (
            <>
              <label>Images:</label>
              {uploadImagesContainer}
            </>
          )}

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
          <FormDanger>
            {formErrors.description && formErrors.description}
          </FormDanger>
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
              <FormDanger>
                {formErrors.location && formErrors.location}
              </FormDanger>
            </>
          )}
          <p></p>
          <Button>{editProduct ? "Update Product" : "Add Product"}</Button>
        </form>
      </ContainerWithForm>
      {modal}
    </>
  );
};

export default AddEditProduct;
