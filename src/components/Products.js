import Product from './Product'; 
import { useLocation } from "react-router-dom"; 

const Products = () => {
   
    const location = useLocation(); 
    const products = location.state; 

    return (
        <> 
        {products.map((product) => {
            return (
                <div key={product.product_id}>
                    <Product product = {product}/>
                </div>
            )
        }) 
    }
       </>
    )
}

export default Products; 

