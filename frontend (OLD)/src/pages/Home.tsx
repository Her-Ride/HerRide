import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/Home.css";
import background from "../assets/background.png";

const Home: React.FC = () => {
  return (
    <div
      className="landing-page"
      style={{ backgroundImage: `url(${background})` }}
    >

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
