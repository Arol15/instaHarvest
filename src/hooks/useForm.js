import { useState } from "react";

/**
 *  useForm
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useForm
 *
 * ```
 * const {setFormData, handleSubmit, handleInputChange, formData, formErrors} = useForm(inputFormData, onSubmit, formValidation);
 * ```
 */

const useForm = (inputFormData, onSubmit, formValidation) => {
  const [formData, setFormData] = useState({ ...inputFormData });
  const [formErrors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event && event.preventDefault();
    const validationErrors = formValidation(formData);
    const isValid = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);

    if (isValid) {
      onSubmit();
    }
  };

  const handleInputChange = (event) => {
    // event.persist();

    if (event.target.type === "range" || event.target.type === "number") {
      setFormData({
        ...formData,
        [event.target.name]: event.target.valueAsNumber,
      });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  return {
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  };
};

export default useForm;
