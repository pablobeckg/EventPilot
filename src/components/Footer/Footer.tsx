import { Link } from "react-router-dom";
import "./Footer.css"

const Footer = () => {
    return (
        <div className="footer-container">
            <Link to='/'>Explore</Link>
            <Link to='/liked'>Events</Link>
            <Link to='/search'>Search</Link>
            <Link to='/profile'>Profile</Link>
        </div>
    );
}
 
export default Footer;