import { useContext, useEffect } from "react"; 
import validation from '../form_validation/validation';
import { useRequest, useForm } from '../hooks/hooks'; 
import { useHistory } from "react-router-dom"; 
import { ModalMsgContext } from '../context/ModalMsgContext'; 
import MainNavbar from './MainNavbar';
import Spinner from "./UI/Spinner"; 


const AddProduct = () => {

    const history = useHistory(); 
    const [ isLoading, data, error, errorNum, sendRequest ] = useRequest(); 
    const [, setModalMsgState] = useContext(ModalMsgContext); 

    const onSubmit = () => {
        sendRequest('/api/products/add-product', "post", formData, true);
    }; 

    const [ setFormData, handleSubmit, handleInputChange, formData, formErrors ] = useForm({
        name: "", 
        product_type: "", 
        image_urls: [],
        price: 0, 
        status: "", 
        description: ""
    }, onSubmit, validation);

    useEffect(() => {
        if (error) {
          setModalMsgState({
            open: true,
            msg: error,
            classes: "mdl-error",
          });
        }
        else if(data) {
          setModalMsgState({
            open: true,
            msg: "Product has been added!",
            classes: "mdl-ok",
          });
          history.push("/user-products");

        }
      }, [data, error, errorNum]);
    
    return(
        <div>
            <MainNavbar />
            <h2>Add your product</h2>
            {isLoading && <Spinner />}
            <form onSubmit={handleSubmit}>
                <label>Name of your product</label>
                <input 
                placeholder="Name" 
                type="text" 
                name="name" 
                onChange={handleInputChange}
                value={formData.name}
                />
                <label>Product Type:</label>
                <select 
                name="product_type" 
                onChange={handleInputChange}
                value={formData.product_type}
                >
                <option>Select Product Type</option>
                <option>Fruit</option>
                <option>Vegetable</option>
                <option>Herb</option>
                <option>Other</option>
                </select>
                <label>Pictures</label>
                <input 
                type="file" 
                name="image_urls" 
                onChange={handleInputChange}
                value={formData.image_urls}
                />
                <label>Price: </label>
                <input 
                placeholder="$0.00" 
                type="number" 
                name="price" 
                onChange={handleInputChange}
                value={formData.price}
                />
                <label>Description: </label>
                <textarea 
                placeholder="Describe your product" 
                type="textarea" 
                name="description" 
                onChange={handleInputChange}
                value={formData.description}
                />
                <button>Add Product</button>
            </form>
        </div>
    )
}

export default AddProduct; 