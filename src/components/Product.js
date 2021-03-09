import { useHistory, useLocation } from "react-router-dom"; 

const Product = ({product, onDelete}, ) => {

    const history = useHistory(); 
    const location = useLocation(); 
    const prevPath = location.pathname;
    // console.log(prevPath)
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const handleClick = (product) => {
        history.push("/product-info", [product])
    }

    return (
        <>
            <div onClick={() => handleClick(product)} style={divStyle} className="product">
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>{product.price}</p>
            </div>
            {prevPath === "/search-results" ? null : 
            (<button onClick={() => onDelete(product.product_id)}>Delete Product</button>)}
        </>
    )
}

export default Product; 