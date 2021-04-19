import { createSlice, findNonSerializableValue } from "@reduxjs/toolkit";
import { loadJSON, saveJSON } from "../utils/localStorage";

const storage = loadJSON("app_data");

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    username: null,
    first_name: storage ? storage.first_name : null,
    last_name: null,
    email: null,
    profile_addr: null,
    zip_code: null,
    address: null,
    image_url: storage ? storage.image_url : null,
    image_back_url: storage ? storage.image_back_url : null,
    email_verified: storage ? storage.email_verified : null,
    city: storage ? storage.city : null,
    us_state: storage ? storage.us_state : null,
    country: storage ? storage.country : findNonSerializableValue,
    created_at: storage ? storage.created_at : null,
  },
  reducers: {
    updateProfile: (state, actions) => {
      const {
        username,
        first_name,
        last_name,
        email,
        profile_addr,
        zip_code,
        address,
        image_url,
        image_back_url,
        email_verified,
        city,
        country,
        us_state,
        created_at,
      } = actions.payload;

      saveJSON("app_data", {
        first_name: first_name,
        image_url: image_url,
        image_back_url: image_back_url,
        email_verified: email_verified,
        city: city,
        country: country,
        us_state: us_state,
        created_at: created_at,
      });

      state.username = username;
      state.first_name = first_name;
      state.last_name = last_name;
      state.email = email;
      state.profile_addr = profile_addr;
      state.zip_code = zip_code;
      state.address = address;
      state.image_url = image_url;
      state.image_back_url = image_back_url;
      state.email_verified = email_verified;
      state.city = city;
      state.country = country;
      state.us_state = us_state;
      state.created_at = created_at;
    },
  },
});

export const { updateProfile } = profileSlice.actions;

export const selectProfile = (state) => ({
  username: state.profile.username,
  first_name: state.profile.first_name,
  last_name: state.profile.last_name,
  email: state.profile.email,
  profile_addr: state.profile.profile_addr,
  zip_code: state.profile.zip_code,
  address: state.profile.address,
  image_url: state.profile.image_url,
  image_back_url: state.profile.image_back_url,
  email_verified: state.profile.email_verified,
  city: state.profile.city,
  country: state.profile.country,
  us_state: state.profile.us_state,
  created_at: state.profile.created_at,
});

export default profileSlice.reducer;
