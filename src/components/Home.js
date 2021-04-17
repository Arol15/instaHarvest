import ShareProducts from "./ShareProducts";
import SearchMain from "./product/SearchMain";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      <ShareProducts />
    </div>
  );
};

export default Home;
