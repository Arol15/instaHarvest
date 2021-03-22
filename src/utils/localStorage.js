import axios from "axios";

export const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));

export const saveJSON = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

export const logout = () =>
  new Promise((resolve, reject) => {
    axios
      .post("/api/auth/logout", {})
      .then(() => {
        localStorage.removeItem("status");
        localStorage.removeItem("app_data");
        resolve(true);
      })
      .catch(() => {
        reject("Something went wrong");
      });
  });

export const checkAuth = () => {
  if (localStorage.getItem("status") === "loggedIn") {
    return true;
  }
  return false;
};
