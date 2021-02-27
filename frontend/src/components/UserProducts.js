import { useRequest } from "../hooks/hooks";
import { useEffect, useState } from "react"; 
import Spinner from './UI/Spinner';
import MainNavbar from "./MainNavbar"; 
import Product from './Product'; 

const UserProducts = () => {

    const [userProducts, setUserProducts] = useState([]);
    const [isLoading, data, error, errorNum, sendRequest] = useRequest(); 

    const getProducts = () => {
        sendRequest("/api/products/products-per-user", "post", null, true)
    }

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        if (data && data.msg === "deleted"){
            getProducts();
        }
        else if(data) {
            setUserProducts(data.user_products)
        }
    }, [data])

    const handleDelete = (product_id) => {
        sendRequest("/api/products/delete_product", "delete", {product_id: product_id}, true)
    }

    console.log(userProducts)
    return(
        <div>
            <MainNavbar />
            <h2>All your products are here! </h2>
            {isLoading && <Spinner />}
            {userProducts && userProducts.map((product) => {
                return(
                    <div key={product.product_id}>
                        <Product product={product} onDelete={handleDelete}/>
                    </div>
                )
            })}
        </div>
    )
}

export default UserProducts; 