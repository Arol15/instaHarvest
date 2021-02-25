export const loadJSON = (key) => key && JSON.parse(localStorage.getItem(key));

export const saveJSON = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const checkAuth = () =>
  localStorage.getItem("access_token") && localStorage.getItem("refresh_token");
