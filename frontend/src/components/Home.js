import ShareProducts from "./ShareProducts";
import Spinner from "./UI/Spinner";
import MainNavbar from './MainNavbar'
import SearchMain from '../components/SearchMain'

const Home = () => {
  // const handleBuyProducts = () => {
  //     history.push('/buy')
  // }

    // const handleBuyProducts = () => {
    //     history.push('/buy')
    // }

    return(
    <div>
      <MainNavbar />
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      {/* <button onClick = {handleBuyProducts}>Buy</button> */}
      <form>
        {/* <input type="text" placeholder="Enter your location" /> */}
        <ShareProducts />
      </form>
    </div>
  );
};

export default Home;
