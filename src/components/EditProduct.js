import {useLocation} from "react-router-dom"; 
import ProductField from "../components/ProductField"; 

const EditProduct = () => {

    const location = useLocation(); 
    const product = location.state; 
    // console.log(location)

    return(
        <div>
            <h3>Edit your product here!</h3>
            <div>
                <ProductField
                    value={product.name}
                    >
                    <p>{product.name}</p>
                </ProductField>
            </div>
            <button>Delete</button>
        </div>
    )
}

export default EditProduct; 