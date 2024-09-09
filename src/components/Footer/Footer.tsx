import { NavLink } from "react-router-dom";
import "./Footer.css";
import EventsIcon from "../../assets/svg/EventsIcon";
import SearchIcon from "../../assets/svg/SearchIcon";
import ProfileIcon from "../../assets/svg/ProfileIcon";
import ExploreIcon from "../../assets/svg/ExploreIcon";

import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname === "/login" || pathname === "/signup") {
    return <></>;
  }
  return (
    <footer>
      <div className="footer-container">
        <NavLink className="add-event-button" to="addevent">
          <img src="/Plus.png" alt="Add event logo" />
        </NavLink>
        <div className="buttons-container">
          <NavLink className="explore-icon" to="/">
            <ExploreIcon />
          </NavLink>
          <NavLink className="events-icon" to="/liked">
            <EventsIcon />
          </NavLink>
          <NavLink className="search-icon" to="/search">
            <SearchIcon />
          </NavLink>
          <NavLink className="profile-icon" to="/profile">
            <ProfileIcon />
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
