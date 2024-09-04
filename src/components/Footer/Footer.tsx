import { Link } from "react-router-dom";
import "./Footer.css"

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="packageContainer">
                <div className="logoPackage">
                    <img src="/compass.png" alt="exploreLogo" />
                    <Link to='/'>Explore</Link>
                </div>
                <div className="logoPackage">
                    <img src="/Calender.png" alt="eventsLogo" />
                    <Link to='/liked'>Events</Link>
                </div>
                <div className="logoPackage">
                    <img src="/search.png" alt="searchLogo" />
                    <Link to='/search'>Search</Link>
                </div>
                <div className="logoPackage">
                    <img src="/profilLogo.png" alt="profilLogo" />
                <Link to='/profile'>Profile</Link>
                </div>
            </div>
        </div>
    );
}
 
export default Footer;