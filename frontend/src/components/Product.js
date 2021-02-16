import { useHistory } from "react-router-dom"; 

const Product = ({products}) => {

    const history = useHistory(); 
    console.log(products)
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const handleClick = (product) => {
        history.push("/product-info", [product])
    }
    return (
        <>
            {products.map((product, key) => {
            return (
                <div onClick={() => handleClick(product)} style={divStyle} className="product" key={key}>
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
                </div>
            )      
        })}
        </>
    )
}

export default Product; 