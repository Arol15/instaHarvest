const validation = (data) => {
  const errors = {};
  if (data.password && data.confirm_pass) {
    if (data.password !== data.confirm_pass) {
      errors.confirm_pass = "Passwords don't match";
    }
    if (!/^[A-z0-9.!?,+]{6,}$/i.test(data.password)) {
      errors.confirm_pass =
        "Password should be at least 6 characters. Allowed characters: A-z 0-9 . , ! ? +";
    }
  }
  Object.entries(data).forEach(([key, value]) => {
    if (key === "username") {
      if (!/^[a-z0-9._]{0,}$/.test(value)) {
        errors.username = "Allowed characters: a-z 0-9 . _";
      }
    }

    if (key === "password") {
      if (!value) {
        errors.password = "Please enter your password";
      }
    }
    if (key === "confirm_pass") {
      if (!value) {
        errors.confirm_pass = "Passwords don't match";
      }
    }
    if (key === "login") {
      if (!value) {
        errors.login = "Please enter your username or email";
      }
    }
    if (key === "email") {
      if (!value) {
        errors.email = "Enter your email";
      } else if (!/^[A-Z0-9.,_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        errors.email = "Invalid email address";
      }
    }
    if (key === "first_name") {
      if (!value) {
        errors.first_name = "Please enter you name";
      }
    }
    if (key === "state") {
      if (!value) {
        errors.state = "Please select state";
      }
    }
    if (key === "city") {
      if (!value) {
        errors.city = "Please enter city";
      }
    }
    if (key === "body") {
      if (!value) {
        errors.body = "Please enter something";
      }
    }
  });

  return errors;
};

export default validation;