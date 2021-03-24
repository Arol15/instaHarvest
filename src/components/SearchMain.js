import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useForm from "../hooks/useForm";
import useRequest from "../hooks/useRequest";
import validation from "../form_validation/validation";
import { checkAuth } from "../utils/localStorage";
import { useDispatch } from "react-redux";
import { showMsg } from "../store/modalSlice";
import Spinner from "./UI/Spinner";

const SearchMain = () => {
  const onSubmit = () => {
    if (checkAuth()) {
      sendRequest("/api/products/get-all-protected", "post", formData);
    } else {
      sendRequest("/api/products/get-all", "post", formData);
    }
  };

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
      <form>
        <input
          type="search"
          placeholder="Enter your location"
          name="search_term"
          onChange={handleInputChange}
          value={formData.search_term}
        />
        <div className="form-danger">
          {formErrors.search_term && formErrors.search_term}
        </div>
        <button onClick={handleSubmit}>Find</button>
      </form>
    </>
  );
};

export default SearchMain;
