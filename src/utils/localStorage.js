import axios from "axios";

export const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));

export const saveJSON = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

export const logout = () => {
  axios
    .post("/api/auth/logout", {})
    .then((resp) => {
      console.log(resp);
      localStorage.removeItem("status");
      localStorage.removeItem("app_data");
      return "ok";
    })
    .catch((error) => {
      console.log("ERROR");
      return "error";
    });
};

export const checkAuth = () => {
  if (localStorage.getItem("status") === "loggedIn") {
    return true;
  }
  return false;
};
