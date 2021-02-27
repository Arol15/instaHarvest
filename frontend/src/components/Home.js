import ShareProducts from "./ShareProducts";
import Spinner from "./UI/Spinner";
import MainNavbar from './MainNavbar'
import SearchMain from '../components/SearchMain'
import Footer from "../components/Footer"; 

const Home = () => {
  
    return(
    <div>
      <MainNavbar />
      <h1>Welcome to instaHarvest</h1>
      <SearchMain />
      <ShareProducts />
      <Footer />
    </div>
  );
};

export default Home;
