import { useContext, useEffect } from "react"; 
import validation from '../form_validation/validation';
import { useRequest, useForm } from '../hooks/hooks'; 
import { useHistory } from "react-router-dom"; 
import { ModalMsgContext } from '../context/ModalMsgContext'; 
import Spinner from "./UI/Spinner"; 
import "./AddProduct.css"; 
import AuthModal from '../components/auth/AuthModal'; 
import {useModal} from '../hooks/hooks'; 
import { checkAuth } from "../utils/localStorage";


const AddProduct = () => {

    const history = useHistory(); 
    const [ isLoading, data, error, errorNum, sendRequest ] = useRequest(); 
    const [, setModalMsgState] = useContext(ModalMsgContext); 

    const [modal, showModal, closeModal] = useModal({
      withBackdrop: true,
      useTimer: false,
      inPlace: false,
    });

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

    const handleAfterConfirm = () => { 
      closeModal()
      window.location.reload();
    }; 

    useEffect(() => {
      if (!checkAuth()) {
        showModal(<AuthModal afterConfirm={handleAfterConfirm}/>)
      }
    }, [])

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
      <>
            {isLoading && <Spinner />}
        <div className="add-product">
            <h2>Share Your Product</h2>
            <form onSubmit={handleSubmit}>
                <label>Name of your product</label>
                <input 
                placeholder="Name" 
                type="text" 
                name="name" 
                onChange={handleInputChange}
                value={formData.name}
                />
                <div className="form-danger">
                  {formErrors.name && formErrors.name}
                </div>
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
                <div className="form-danger">
                  {formErrors.product_type && formErrors.product_type}
                </div>
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
                <div className="form-danger">
                  {formErrors.description && formErrors.description}
                </div>
                <button>Add Product</button>
            </form>
        </div>
        {modal}
      </>
    )
}

export default AddProduct; 