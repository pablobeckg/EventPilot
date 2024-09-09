import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import LogInPage from "../LogInPage/LogInPage";


const Loading = () => {

    const userContext = useUserContext();
    const loading = userContext?.loading

    useEffect(() => {
        const { setLoading } = useUserContext();
        setTimeout(() => {
          setLoading(true);
        }, 2250);
      }, []);

    return (
        <> 
        {loading ? (
        <div className="loading-screen-wrapper">
            <div className="loading-logo-wrapper">
                <img src="/Logo.png" alt="logo" />
            </div>
            <div className="loading-animation-wrapper">
                <h1>ANIMATION</h1>
            </div>
        </div>
        ): ( <LogInPage />)}
        </>
     );
}
 
export default Loading;