import { useEffect, useState } from "react";
import validation from "../../form_validation/validation";
import { useRequest, useForm } from "../../hooks/hooks";
import { useHistory } from "react-router-dom";
import "./AddProduct.css";
import AuthModal from "../auth/AuthModal";
import { useModal } from "../../hooks/hooks";
import { checkAuth } from "../../utils/localStorage";
import ToggleInput from "../UI/ToggleInput";
import { showMsg } from "../../store/modalSlice";
import { useDispatch } from "react-redux";
import Spinner from "../UI/Spinner";

const AddProduct = () => {
  const history = useHistory();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const dispatch = useDispatch();
  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
    disableClose: true,
  });

  const onSubmit = () => {
    sendRequest("/api/products/add-product", "post", formData);
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
      image_urls: [],
      price: 0,
      status: "",
      description: "",
    },
    onSubmit,
    validation
  );

  const handleAfterConfirm = () => {
    closeModal();
    window.location.reload();
  };

  useEffect(() => {
    if (!checkAuth()) {
      showModal(<AuthModal afterConfirm={handleAfterConfirm} />);
    }
  }, []);

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
      dispatch(
        showMsg({
          open: true,
          msg: "Product has been added!",
          classes: "mdl-ok",
        })
      );
      history.push("/user-products");
    }
  }, [data, error, errorNum]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="add-product">
        <h2>Share Your Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Name of your product</label>
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
          <label>Pictures</label>
          <input
            className="add-product-input"
            type="file"
            name="image_urls"
            onChange={handleInputChange}
            value={formData.image_urls || ""}
          />
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

          <button>Add Product</button>
        </form>
      </div>
      {modal}
    </>
  );
};

export default AddProduct;
