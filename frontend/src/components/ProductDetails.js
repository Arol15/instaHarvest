import { useLocation } from "react-router-dom"; 
import { useEffect } from "react"; 

const ProductDetails = () => {
    const location = useLocation(); 
    const product_user_id = location.state[0].user_id

    

    return (
        <div>
            Longitute and Latitude
        </div>

    )
}

export default ProductDetails; 