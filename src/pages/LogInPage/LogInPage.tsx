import { useState } from "react";
import "./LogInPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import supabaseClient from "../../lib/supabaseClient";

const LogInPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const userContext = useUserContext();

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
        console.log('User erfolgreich angemeldet', authResponse.data.user);
        setSuccessMessage('Login successful.');
        userContext?.setUser(authResponse.data.user);
        setTimeout(() => navigate('/'), 1000);
      }

  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Sign in</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Sign in</button>
      </form>
      <div className="reset-password-container">
        {/* <button className="additional-button" onClick={handleResetPassword}>
          Forgot your password?
        </button> */}
        <h3>Don’t have an account?   <Link to="/signup">
          Sign Up
        </Link></h3>
       
      </div>
    </div>
  );
};

export default LogInPage;
