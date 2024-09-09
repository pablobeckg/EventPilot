import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
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
        </div>
        <div className="loading-animation-wrapper">
          <h1>ANIMATION</h1>
        </div>
      </div>
    </>
  );
};

export default Loading;
