import useRequest from "../hooks/useRequest";
import { useHistory } from "react-router-dom";

const ShareProducts = () => {
    
    const [isLoading, data, error, errorNum, sendRequest] = useRequest();
    const history = useHistory();


    const handleSellProducts = () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken){
            history.push("/login");
        }
        else {
            history.push('/add-product')
        }
    }

    return(
        <div>
            <button onClick = {handleSellProducts}>Share</button>
        </div>
    )
}

export default ShareProducts; 