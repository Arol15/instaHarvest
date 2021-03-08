import Product from './Product'; 
import { useLocation, Link } from "react-router-dom"; 

const Products = () => {
   
    const location = useLocation(); 
    const products = location.state; 

    return (
        <> 
        {products.length !== 0 ? (products.map((product) => {
            return (
                <div key={product.product_id}>
                    <Product product = {product}/>
                </div>
            )
        })) : (
            <>
        <h1>Sorry, No results for this location...</h1>
        <Link to="/">Try Again</Link>
        </>
        )}
       </>
    )
}

export default Products; 

