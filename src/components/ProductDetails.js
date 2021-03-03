import { useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
import useRequest from "../hooks/useRequest"; 

const ProductDetails = () => {
    const location = useLocation(); 
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [locationInfo, setLocationInfo] = useState({})

    const product_user_id = location.state[0].user_id

    useEffect(() => {
        sendRequest(`/api/products/product-location-info/${product_user_id}`, "get"); 
    }, [])

    useEffect(() => {
        if(data) {
            setLocationInfo(data)
        }
    }, [data])

    // console.log(locationInfo)

    return (
        <div>
            {locationInfo.lat} {locationInfo.lgt}
        </div>

    )
}

export default ProductDetails; 