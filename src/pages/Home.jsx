import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/new-booking', icon: '🛫', label: 'New Booking' },
    { path: '/exchange', icon: '🔄', label: 'Exchange' },
    { path: '/future-credit', icon: '💳', label: 'Future Credit' },
    { path: '/refund', icon: '💵', label: 'Refund' },
  ];

  const handleNav = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <div className="home-hero-bg">

      {/* Hamburger Button */}
      <button
        className="home-hamburger"
        onClick={() => setSidebarOpen(true)}
        title="Open menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="home-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`home-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="home-sidebar-header">
          <div className="logo-icon-blue">✈</div>
          <div className="logo-text">
            <h2>SkyBook CRM</h2>
            <p>Travel Management</p>
          </div>
          <button
            className="home-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="home-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className="home-nav-item"
              onClick={() => handleNav(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Card */}
      <div className="hero-glass-card">
        <h1 className="hero-top-label">✈ SKYBOOK</h1>
        <h1 className="hero-title">SkyBook CRM</h1>
        <p className="hero-subtitle">
          Professional travel management made simple.
          Manage bookings, exchanges, and refunds with precision.
        </p>
        <Link to="/dashboard" className="cta-button">
          Enter CRM Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;