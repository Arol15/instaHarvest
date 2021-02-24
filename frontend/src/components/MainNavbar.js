import { Link } from "react-router-dom"; 
import "./MainNavbar.css"

const MainNavbar = () => { 
    
    return(
        <nav className='main-navbar'>
            <div>instaHarvest Logo</div>
            <div classsName="main-navbar-links">
                <div>
                    <Link to="/login">Login</Link>
                </div>
                <div>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </nav>
    )
}

export default MainNavbar; 