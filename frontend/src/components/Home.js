import { useHistory } from "react-router-dom";

const Home = () => {

    const history = useHistory();

    const handleBuyProducts = () => {
        history.push('/buy')
    }
    const handleSellProducts = () => {
        history.push('/sign-up')
    }

    return(
    <div>
        <h1>Welcome to instaHarvest</h1>
        <button onClick = {handleBuyProducts}>Buy</button>
        <button onClick = {handleSellProducts}>Sell</button>
    </div>
    )
}

export default Home; 