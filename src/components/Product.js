import { useHistory, useLocation } from "react-router-dom"; 

const Product = ({product, onDelete, user_id}, ) => {

    const history = useHistory(); 
    const location = useLocation(); 
    const prevPath = location.pathname;
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const handleClick = (product) => {
        history.push("/product-info", product)
    }

    const handleClickEdit = (product) => {
        history.push("edit-product", product)
    }
    console.log(prevPath)

    return (
        <>
        {(user_id === product.user_id || prevPath === '/user-products') ? (
            <div style={divStyle}>
                {/* <h1>Your product</h1> */}
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={() => handleClickEdit(product)}>Edit Product</button>
                </div>
        ) : (
            <div onClick={() => handleClick(product)} style={divStyle} className="product">
            <p>{product.name}</p>
            <p>{product.description}</p>
            <p>${product.price}</p>
            </div>)
        }
            {prevPath === "/search-results" ? null : 
            (<button onClick={() => onDelete(product.product_id)}>Delete Product</button>)}
        </>
    )
}

export default Product; 