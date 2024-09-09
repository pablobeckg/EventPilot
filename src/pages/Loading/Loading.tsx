import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import "./Loading.css"

const Loading = () => {
  const userContext = useUserContext();
  const setLoadingPage = userContext?.setLoadingPage;

  useEffect(() => {
    if (setLoadingPage) {
      setTimeout(() => {
        setLoadingPage(false);
      }, 2250);
    }
  }, []);

  return (
    <>
      <div className="loading-screen-wrapper">
        <div className="loading-logo-wrapper">
          <img src="/Logo.png" alt="logo" />
          <span className="loading-logo-text-first">
            vent
          </span>
          <span className="loading-logo-text-scnd">
            Pilot
          </span>
        </div>
        <div className="loading-animation-wrapper">
          <svg
  className="container" 
  x="0px" 
  y="0px"
  viewBox="0 0 50 31.25"
  height="31.25"
  width="50"
  preserveAspectRatio='xMidYMid meet'
>
  <path 
    className="track"
    strokeWidth="4" 
    fill="none" 
    pathLength="100"
    d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
  />
  <path 
    className="car"
    strokeWidth="4" 
    fill="none" 
    pathLength="100"
    d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
  />
</svg>
            </div>
        </div>
    </>
  );
};

export default Loading;


