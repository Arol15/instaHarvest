import { useState } from "react";
import ShareProducts from "./ShareProducts";
import SearchMain from "../components/SearchMain";
import Footer from "../components/Footer";
import { useRequest, useForm } from "../hooks/hooks";
import validation from "../form_validation/validation";

const Home = () => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  const [image, setImage] = useState();

  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
    sendRequest("/api/account/update_profile_image", "post", formData, true);
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setImage(event.target.files[0]);
  };
  console.log(image);
  return (
    <div>
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      <ShareProducts />
      <Footer />
      <form encType="multipart/form-data" onSubmit={onSubmit}>
        <input
          type="file"
          name="image_url"
          accept="image/*"
          onChange={handleInputChange}
        ></input>
        <button>Save</button>
      </form>
    </div>
  );
};

export default Home;
