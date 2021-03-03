import { useHistory } from "react-router-dom"; 
// import {useRequest} from "../hooks/hooks"; 
// import { useEffect } from "react"; 

const Product = ({product, onDelete}, ) => {

    // const [isLoading, data, error, errorNum, sendRequest] = useRequest();

    const history = useHistory(); 
    // console.log(product)
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const handleClick = (product) => {
        history.push("/product-info", [product])
    }

//    const deleteProduct = () => {
//        onDelete(product.product_id)
//    }

    return (
        <>
            <div onClick={() => handleClick(product)} style={divStyle} className="product">
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
            </div>
            <button onClick={() => onDelete(product.product_id)}>Delete Product</button>
        </>
    )
}

export default Product; 