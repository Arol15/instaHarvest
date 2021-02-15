import ShareProducts from "./ShareProducts";
import Spinner from "./UI/Spinner";
import MainNavbar from './MainNavbar'

const Home = () => {
  // const handleBuyProducts = () => {
  //     history.push('/buy')
  // }

  return (
    <div>
      <MainNavbar />
      <h1>Welcome to instaHarvest</h1>
      {/* <button onClick = {handleBuyProducts}>Buy</button> */}
      <form>
        <input type="text" placeholder="Enter your location" />
        <ShareProducts />
      </form>
    </div>
  );
};

export default Home;
