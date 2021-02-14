const Product = ({products}) => {
    console.log(products)
    const divStyle = {
        border: "1px solid black", 
        margin: "5px"
    }
    return (
        <>
            {products.map((product, key) => {
            return (
                <div style={divStyle} className="product" key={key}>
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