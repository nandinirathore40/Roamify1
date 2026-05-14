import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css' 

const Layout = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
      navigate('/')
    }
  }

  // Active tab check karne ke liye helper
  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div className="crm-layout">
      {/* ---------------- SHARED SIDEBAR ---------------- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-blue">✈</div>
          <div className="logo-text">
            <h2>SkyBook CRM</h2>
            <p>Travel Management</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${isActive('/dashboard')}`} onClick={() => navigate('/dashboard')}>
            📊 Dashboard
          </button>
          <button className={`nav-item ${isActive('/new-booking')}`} onClick={() => navigate('/new-booking')}>
            🛫 New Booking
          </button>
          <button className={`nav-item ${isActive('/exchange')}`} onClick={() => navigate('/exchange')}>
            🔄 Exchange
          </button>
          <button className={`nav-item ${isActive('/future-credit')}`} onClick={() => navigate('/future-credit')}>
            💳 Future Credit
          </button>
          <button className={`nav-item ${isActive('/refund')}`} onClick={() => navigate('/refund')}>
            💵 Refund
          </button>
        </nav>

        {/* --- YAHAN MAIN CHANGE HAI --- */}
        <div className="sidebar-footer">
          {/* 1. User Profile Upar */}
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info">
              <h4>John Doe</h4>
              <p>Agent</p>
            </div>
          </div>

          {/* 2. Logout Button Niche */}
          <button className="logout-btn-standalone" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ---------------- DYNAMIC CONTENT ---------------- */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout