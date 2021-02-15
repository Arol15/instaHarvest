
const Product = ({products}) => {
    console.log(products)
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }

    const handleClick = (user_id) => {
        
        console.log("clicked", user_id)
    }
    return (
        <>
            {products.map((product, key) => {
            return (
                <div onClick={() => handleClick(product.user_id)} style={divStyle} className="product" key={key}>
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