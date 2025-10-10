import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LearnMore.css";
import background from "../assets/background.png";

const LearnMore: React.FC = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div
      className="learn-more-page"
      style={{ backgroundImage: `url(${background})` }} 
    >
      <div className="learn-more-container">
        <h2>HOW IT WORKS</h2>
        <div className="how-box">
          <div className="how-step">
            <h3>CREATE A PROFILE</h3>
            <p>Sign up with your name, location, and schedule.</p>
          </div>
          <div className="how-step">
            <h3>FIND A MATCH</h3>
            <p>
              Our smart algorithm suggests riders headed your way using Google Maps routing.
            </p>
          </div>
          <div className="how-step">
            <h3>SHARE THE RIDE</h3>
            <p>
              Request or approve rides, split costs, and build a supportive network.
            </p>
          </div>
        </div>

        <div className="ready-box">
          <span>READY?</span>
          <button className="login-btn" onClick={handleLoginClick}>LOG IN</button>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
