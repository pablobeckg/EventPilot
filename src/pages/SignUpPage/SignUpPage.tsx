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
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

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
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="signup-container">
      <div className="logoHeader">
        <img src="./Header.png" alt="Header" />
      </div>
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Sign up</h2>
        <div className="login-field">
          <img src="/Profile.png" alt="" />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="login-field">
          <img src="/Message.png" alt="" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="loginInputField">
          <div className="password-input">
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
        <div className="loginInputField">
          <div className="password-input">
            <img src="/Lock.png" alt="" />
            <input
              type={passwordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              required
            />
          </div>

          <button type="button" onClick={togglePasswordVisibility}>
            <img
              src={passwordVisible ? "/Hidden.png" : "/Visible.png"}
              alt=""
            />
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="button-info-container">
          <button className="signupButton" type="submit">
            Sign Up <img src="./Arrow.png" alt="ArrowButton" />
          </button>
          <h3>
            Already have an account?{" "}
            <Link to="/login">
              <span>Sign In</span>
            </Link>
          </h3>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
