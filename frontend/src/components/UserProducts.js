import { useRequest } from "../hooks/hooks";
import { useEffect, useState } from "react"; 
import Spinner from './UI/Spinner';
import MainNavbar from "./MainNavbar"; 
import Product from './Product'; 


const UserProducts = () => {

    const [userProducts, setUserProducts] = useState([]);

    const [isLoading, data, error, errorNum, sendRequest] = useRequest(); 

    useEffect(() => {
        sendRequest("/api/products/products-per-user", "post", null, true)
    }, [])
    // console.log(data)

    useEffect(() => {
        if(data) {
            setUserProducts(data.user_products)
        }
    }, [data])

    // console.log(userProducts)
    return(
        <div>
            <MainNavbar />
            <h2>All your products are here! </h2>
            {isLoading && <Spinner />}
            <Product products={userProducts}/>
        </div>
    )
}

export default UserProducts; 