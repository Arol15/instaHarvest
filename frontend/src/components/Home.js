import ShareProducts from "./ShareProducts"
import SearchMain from './SearchMain'

const Home = () => {

    // const handleBuyProducts = () => {
    //     history.push('/buy')
    // }

    return(
    <div>
        <h1>Welcome to instaHarvest</h1>
            <SearchMain />
            <ShareProducts />
    </div>
    )
}

export default Home; 