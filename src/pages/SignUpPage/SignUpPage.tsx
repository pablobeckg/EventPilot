import { useState } from "react";
import "./SignUpPage.css";
import supabaseClient from "../../lib/supabaseClient";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const signupResponse = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userName,
        },
      },
    });

    if (signupResponse.error) {
      setErrorMessage(signupResponse.error.message);
      return;
    }
    if (signupResponse.data.user) {
      setSuccessMessage("Signup successful. Please look into your emails.");
    }
  };

  return (
    <div className="signup-container">
      <div className="logoHeader">
        <img src="./Header.png" alt="Header" />
      </div>
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Sign up</h2>
        <input className="signupInputField"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <input className="signupInputField"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input className="signupInputField"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <input className="signupInputField"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter your password again"
          required
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button className="signupButton" type="submit">Sign Up <img src="./Arrow.png" alt="ArrowButton" /></button>
      </form>
      <h3>
        Already have an account? <Link to="/login"><span>Sign In</span></Link>
      </h3>
    </div>
  );
};

export default SignUpPage;
