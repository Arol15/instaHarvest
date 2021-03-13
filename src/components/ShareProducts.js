import { useHistory } from "react-router-dom";

const ShareProducts = () => {
    
    const history = useHistory();

    return(
        <div>
            <button onClick = {() => history.push("/add-product")}>Share</button>
        </div>
    )
}

export default ShareProducts; 