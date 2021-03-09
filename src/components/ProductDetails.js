import { useLocation, useHistory } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
import useRequest from "../hooks/useRequest"; 

const ProductDetails = () => {
    // const history = useHistory(); 
    const location = useLocation(); 
    const user_id = location.state.user_id; 
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [info, setInfo] = useState({})

    // const openChat = (recipientId, recipientName, recipientImg) => {
    //   history.push({
    //     pathname: `/chats/${recipientName}`,
    //     state: {
    //       recipientId: recipientId,
    //       recipientName: recipientName,
    //       recipientImg: recipientImg,
    //     },
    //   });
    // };

    useEffect(() => {
        sendRequest(`/api/products/product-location-info/${user_id}`, "get"); 
    }, [])

    useEffect(() => {
        if(data) {
            setInfo(data.product_details)
        }
    }, [data])

    // console.log(info)
    return (
        <div>
            <div>
                {location.state.name}
            </div>
            <p>{location.state.description}</p>
            <div>
                Location for map: {info.lat} and {info.lgt}
            </div>
            <button>Connect with seller</button>
        </div>

    )
}

export default ProductDetails; 