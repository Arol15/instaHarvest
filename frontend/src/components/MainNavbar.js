import { Link } from "react-router-dom"; 
import { useState } from 'react'; 
import "./MainNavbar.css"

const MainNavbar = () => { 

    const [ isToken, setToken ] = useState(
        localStorage.getItem("access_token") ? true : false
    )
    // console.log(isToken)

    useEffect(() => {

    })
    
    return(
        <nav className='main-navbar'>
            <div>instaHarvest Logo</div>
            {isToken ? (
                <div>
                    First Name
                </div>
            ) : 
            (<div className="main-navbar-links">
                <div>
                    <Link to="/login">Login</Link>
                </div>
                <div>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </div>)
            }
        </nav>
    )
  
}

export default MainNavbar; 