import { useHistory } from "react-router-dom"; 
import {useRequest} from "../hooks/hooks"; 

const Product = ({products}) => {

    const [isLoading, data, error, errorNum, sendRequest] = useRequest();

    const history = useHistory(); 
    console.log(products)
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const handleClick = (product) => {
        history.push("/product-info", [product])
    }

    const handleDelete = (product_id) => {
        sendRequest("/api/products/deleteproduct", "delete", product_id, true)
        history.push('/user-products')
    }

    return (
        <>
            {products.map((product, key) => {
            return (
                <div onClick={() => handleClick(product)} style={divStyle} className="product" key={key}>
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <button onClick={handleDelete}>Delete Product</button>
                </div>
            )      
        })}
        </>
    )
}

export default Product; 