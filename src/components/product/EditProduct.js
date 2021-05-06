import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRequest, useForm } from "../../hooks/hooks";

import { Button } from "../styled/buttons";

import { showMsg } from "../../store/modalSlice";
import { validation } from "../../form_validation/validation";

import "./editProduct.css";

const EditProduct = () => {
  const location = useLocation();
  const history = useHistory();
  const product = location.state;

  const onSubmit = () => {
    sendRequest(
      `/api/products/edit-product/${product.product_id}`,
      "patch",
      formData
    );
  };

  const dispatch = useDispatch();
  const { data, error, errorNum, sendRequest } = useRequest();
  const { handleSubmit, handleInputChange, formData } = useForm(
    {
      name: product.name,
      product_type: product.product_type,
      image_urls: product.urls,
      price: product.price,
      status: product.status,
      description: product.description,
    },
    onSubmit,
    validation
  );

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    } else if (data) {
      dispatch(
        showMsg({
          open: true,
          msg: "Product has been added!",
          type: "ok",
        })
      );
      history.push("/user-products");
    }
  }, [data, error, errorNum]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="edit-product">
      <h2>Edit Your Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name of your product</label>
        <input
          placeholder="Name"
          type="text"
          name="name"
          onChange={handleInputChange}
          value={formData.name}
        />
        <label>Product Type:</label>
        <select
          name="product_type"
          onChange={handleInputChange}
          value={formData.product_type}
        >
          <option>Select Product Type</option>
          <option>Fruit</option>
          <option>Vegetable</option>
          <option>Herb</option>
          <option>Other</option>
        </select>
        <label>Pictures</label>
        <input
          type="file"
          name="image_urls"
          onChange={handleInputChange}
          value={formData.image_urls}
        />
        <label>Price: </label>
        <input
          placeholder="$0.00"
          type="number"
          name="price"
          onChange={handleInputChange}
          value={formData.price}
        />
        <label>Description: </label>
        <textarea
          placeholder="Describe your product"
          type="textarea"
          name="description"
          onChange={handleInputChange}
          value={formData.description}
        />
        <Button>Save Changes</Button>
        <Button
          onClick={() => {
            history.push("/user-products");
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default EditProduct;
