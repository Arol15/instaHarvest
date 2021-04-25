import { useState } from "react";

/**
 *  useForm
 * @see https://github.com/Arol15/instaHarvest/blob/master/API.md#useForm
 *
 * ```
 * const [setFormData, handleSubmit, handleInputChange, formData, formErrors] = useForm(formData, onSubmit, formValidation);
 * ```
 */

const useForm = (formData, onSubmit, formValidation) => {
  const [formState, setFormState] = useState({ ...formData });
  const [formErrors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event && event.preventDefault();
    const validationErrors = formValidation(formState);
    const isValid = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);

    if (isValid) {
      onSubmit();
    }
  };

  const handleInputChange = (event) => {
    // event.persist();
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  return [setFormState, handleSubmit, handleInputChange, formState, formErrors];
};

export default useForm;
