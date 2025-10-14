import React from "react";
import "../styles/LoginSignup.css";
import background from "../assets/background.png";

const LoginSignup: React.FC = () => {
  return (
    <div className="login-signup-container">
      {/* Left side - login form */}
      <div className="login-left">
        <div className="login-form">
          <h1>Log into your account</h1>
          <p className="subheading">Welcome back! Select method to log in</p>

          {/* Social login options */}
          <div className="social-login">
            <button className="social-btn">Continue with Gmail</button>
            <button className="social-btn">Continue with Facebook</button>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>or continue with email</span>
          </div>

          {/* Email/password form */}
          <form className="email-login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <div className="form-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Log In
            </button>

            <p className="signup-text">
              Don’t have an account? <a href="/signup">Create an account</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - background image */}
      <div
        className="login-right"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
    </div>
  );
};

export default LoginSignup;
