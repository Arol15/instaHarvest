import { useHistory } from "react-router-dom";

const Home = () => {

    const history = useHistory();

    // const handleBuyProducts = () => {
    //     history.push('/buy')
    // }
    const handleSellProducts = () => {
        history.push('/sign-up')
    }

    return(
    <div>
        <h1>Welcome to instaHarvest</h1>
        {/* <button onClick = {handleBuyProducts}>Buy</button> */}
        <form>
            <input type="text" placeholder="Enter your location"/>
        </form>
        <button onClick = {handleSellProducts}>Share</button>
    </div>
    )
}

export default Home; 