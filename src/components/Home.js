import ShareProducts from "./ShareProducts";
import SearchMain from '../components/SearchMain'
import Footer from "../components/Footer"; 

const Home = () => {
  
    return(
    <div>
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      <ShareProducts />
      <Footer />
    </div>
  );
};

export default Home;
