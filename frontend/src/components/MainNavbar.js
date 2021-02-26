import { Link, useHistory } from "react-router-dom"; 
import { useState } from 'react'; 
import "./MainNavbar.css"
import { checkAuth, loadJSON } from '../utils/localStorage'; 

const MainNavbar = () => { 

    const history = useHistory(); 

    const logout = () => {
//TODO: use modal to display message on the logout
        const toLogout = window.confirm("Are you sure to logout?"); 
        if (toLogout) {
            localStorage.clear(); 
            history.push("/")
        }
    }

    return(
        <nav className='main-navbar'>
            <div>instaHarvest Logo</div>
            {checkAuth() ? (
            <div className="main-navbar-links">
                <div>
                    {loadJSON("app_data").first_name}
                </div>
                <button onClick={logout}>
                    Logout
                </button>

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