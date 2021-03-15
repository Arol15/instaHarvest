import {  useState} from "react"
import ShareProducts from "./ShareProducts";
import SearchMain from '../components/SearchMain'
import Footer from "../components/Footer"; 
import { useRequest, useForm } from "../hooks/hooks"
import validation from '../form_validation/validation';

const Home = () => {

  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  
  const [image, setImage] = useState();
  
  const onSubmit = (event) => {
    event.preventDefault();
    console.log(image)
    sendRequest("/api/account/image", "post", image, true);
  };



  // const [
  //   setFormData,
  //   handleSubmit,
  //   handleInputChange,
  //   formData,
  //   formErrors,
  // ] = useForm(
  //   {
  //     image_url: ""
  //   },
  //   onSubmit,
  //   validation
  // );
  // console.log(formData)

  const handleInputChange = (event) => {
    event.preventDefault();
    // console.log(event)
    console.log(event.target.files)
    setImage({"image_url": event.target.files[0]});
    
  };

  // const file = document.querySelector('input[name="image_url"]')
  //formData.append('image', file.files[0])
  // useEffect(() )
    return(
    <div>
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      <ShareProducts />
      <Footer />
      <form encType="multipart/form-data" onSubmit={onSubmit}>
        <input
          type="file"
          name="image_url"
          accept="image/jpeg"
          onChange={handleInputChange}
          
        ></input>
        <button>Save</button>
      </form>
    </div>
  );
};

export default Home;
