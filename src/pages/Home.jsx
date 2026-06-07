import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-hero-bg">
      {/* Main Card */}
      <div className="hero-glass-card">
        <h1 className="hero-top-label">✈ ROAMIFY</h1>
        
        <p className="hero-subtitle">
          Professional travel management made simple.
          Manage bookings, exchanges, and refunds with precision.
        </p>
        <Link to="/dashboard" className="cta-button">
          Sign In to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;