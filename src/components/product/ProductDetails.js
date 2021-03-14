import { useLocation, useHistory } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
import useRequest from "../../hooks/useRequest"; 
import Spinner from '../UI/Spinner'; 
import { checkAuth } from "../../utils/localStorage";
import AuthModal from '../auth/AuthModal'; 
import {useModal} from '../../hooks/hooks'

const ProductDetails = () => {
    const history = useHistory(); 
    const location = useLocation(); 
    const user_id = location.state.user_id; 
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const [info, setInfo] = useState({}); 

    const [modal, showModal, closeModal] = useModal({
        withBackdrop: true,
        useTimer: false,
        inPlace: false,
      });

    const openChat = (recipientId, recipientName, recipientImg) => {
      history.push({
        pathname: `/chats/${recipientName}`,
        state: {
          recipientId: recipientId,
          recipientName: recipientName,
          recipientImg: recipientImg,
        },
      });
    };

    const handleAfterConfirm = () => { 
        openChat(location.state.user_id, info.first_name, info.image_url)
        window.location.reload();
    }; 

    useEffect(() => {
        sendRequest(`/api/products/product-location-info/${user_id}`, "get"); 
    }, []); 

    useEffect(() => {
        if(data) {
            setInfo(data.product_details)
        }
    }, [data]); 

    return (
        <>
        <div>
            {isLoading && <Spinner />}
            <div>
                Product: {location.state.name}
            </div>
            <p>About this product: {location.state.description}</p>
            <div>
                Location for map: {info.lat} and {info.lgt}
            </div>
            {checkAuth() ? (  
                <button onClick={() => openChat(
                    location.state.user_id, 
                    info.first_name, 
                    info.image_url,
                )}>Connect with seller</button>) : (
                    <button onClick={() => showModal(<AuthModal afterConfirm={handleAfterConfirm}/>)}>Connect with Seller</button>
                )
            }
        </div>
        {modal}
        </>

    )
}

export default ProductDetails; 