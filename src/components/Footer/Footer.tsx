import { Link, NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <NavLink className="add-event-button" to="addevent">
        <img src="/Plus.png" alt="Add event logo" />
      </NavLink>

      <div className="buttons-container">
        <div className="logoPackage">
          <NavLink to="/">
            <img src="/Explore.png" alt="eventsLogo" />
          </NavLink>
        </div>
        <div className="logoPackage">
          <NavLink to="/liked">
            <img src="/Events.png" alt="eventsLogo" />
          </NavLink>
        </div>
        <div className="logoPackage">
          <NavLink to="/search">
            <img src="/Search.png" alt="searchLogo" />
          </NavLink>
        </div>
        <div className="logoPackage">
          <NavLink to="/profile">
            <img src="/Profile-footer.png" alt="profilLogo" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
