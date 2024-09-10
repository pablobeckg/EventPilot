import { useState } from "react";
import "./LogInPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import supabaseClient from "../../lib/supabaseClient";
import Loading from "../Loading/Loading";

const LogInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const navigate = useNavigate();
  const userContext = useUserContext();
  const user = userContext?.user;
  const loadingPage = userContext?.loadingPage;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const authResponse = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (authResponse.error) {
      console.error("Login error", authResponse.error.message);
      setErrorMessage(authResponse.error.message);
      return;
    }
    if (authResponse.data?.user) {
      console.log("User erfolgreich angemeldet", authResponse.data.user);
      setSuccessMessage("Login successful.");
      userContext?.setUser(authResponse.data.user);
      setTimeout(() => navigate("/"), 1000);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const resetResponse = await supabaseClient.auth.resetPasswordForEmail(email);

    if (resetResponse.error) {
      console.error(resetResponse.error.message);
      setErrorMessage(resetResponse.error.message);
      return;
    }

    if (resetResponse.data) {
      setSuccessMessage('Password reset link has been sent to your email.');
    }
  };

  return (
    <>
      {!user && loadingPage ? (
        <Loading />
      ) : (
        <div className="login-container">
          <div className="logoHeader">
            <img src="./Header.png" alt="Header" />
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Sign in</h2>
            <div className="email-input">
              <img src="/Message.png" alt="" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="password-container">
              <div className="password-elements">
                <img src="/Lock.png" alt="" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="button"
                className="password-toggle-button"
                onClick={togglePasswordVisibility}
              >
                <img
                  src={passwordVisible ? "/Hidden.png" : "/Visible.png"}
                  alt=""
                />
              </button>
            </div>
            <button className="reset-password-button" onClick={handleResetPassword}>
          Forgot your password?
        </button>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            <div className="account-container">
              <button className="loginButton" type="submit">
                Sign in <img src="./Arrow.png" alt="ArrowButton" />
              </button>
              <h3>
                Don’t have an account?{" "}
                <Link to="/signup">
                  <span>Sign-Up</span>
                </Link>
              </h3>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LogInPage;
