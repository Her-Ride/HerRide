import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/Home.css";
import logo from "../assets/logo.png";
import background from "../assets/background.png";

const Home: React.FC = () => {
  return (
    <div
      className="landing-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* logo */}
      <header className="landing-header">
        <div className="logo-container">
          <img src={logo} alt="HerRide Logo" className="logo" />
          <span className="brand-name">HerRide</span>
        </div>

        {/* nav & icon */}
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#">Dashboard</a>
            <a href="#">My Rides</a>
            <a href="#">Messages</a>
          </nav>
          <div className="profile-icon">👤</div>
        </div>
      </header>

      {/* hero / main txt */}
      <main className="landing-content">
        <h1>
          CARPOOLING <br /> MADE FOR WOMEN
        </h1>
        <p>Safety for women, serenity for the world.</p>
        <div className="button-group">
          <button className="primary-btn">PLAN A RIDE</button>
          <Link to="/learn-more" className="secondary-btn-link">
            <button className="secondary-btn">LEARN MORE</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
