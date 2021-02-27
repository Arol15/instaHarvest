import { useHistory } from "react-router-dom"; 
import {useRequest} from "../hooks/hooks"; 
import { useEffect } from "react"; 

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
        console.log(product_id)
        sendRequest("/api/products/delete_product", "delete", {product_id: product_id}, true)
        // history.push('/user-products')
    }

    useEffect(() => {
        
    })

    return (
        <>
            {products.map((product, key) => {
            return (
                <>
                <div onClick={() => handleClick(product)} style={divStyle} className="product" key={key}>
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
                </div>
                <button onClick={()=>handleDelete(product.product_id)}>Delete Product</button>
                </>
            )      
        })}
        </>
    )
}

export default Product; 