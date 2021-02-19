import { useState } from "react";
import validateForm from "../utils/validateForm";

const useForm = (sendRequest) => {
  const [formState, setFormState] = useState({});
  const [formErrors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formState);
    const isValid = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    console.log("HandleSubmit: ");
    console.log(validationErrors);
    if (isValid) {
      sendRequest();
    }
  };

  const handleInputChange = (event) => {
    event.persist();
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  return [setFormState, handleSubmit, handleInputChange, formState, formErrors];
};

export default useForm;
