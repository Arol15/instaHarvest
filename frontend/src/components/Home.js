import ShareProducts from "./ShareProducts";
import Spinner from "./UI/Spinner";

const Home = () => {
  // const handleBuyProducts = () => {
  //     history.push('/buy')
  // }

  return (
    <div>
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
