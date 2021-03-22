import axios from "axios";

export const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));

export const saveJSON = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

// export const logout = async () => {
//   let resp = await axios
//     .post("/api/auth/logout", {})
//     .then((resp) => {
//       localStorage.removeItem("status");
//       localStorage.removeItem("app_data");
//       return true;
//     })
//     .catch((error) => {
//       return false;
//     });
//   return resp;
// };

export const logout = () =>
  new Promise((resolve, reject) => {
    axios
      .post("/api/auth/logout", {})
      .then((resp) => {
        localStorage.removeItem("status");
        localStorage.removeItem("app_data");
        resolve(true);
      })
      .catch((error) => {
        console.log(error);
        reject("Something went wrong");
      });
  });

export const checkAuth = () => {
  if (localStorage.getItem("status") === "loggedIn") {
    return true;
  }
  return false;
};
