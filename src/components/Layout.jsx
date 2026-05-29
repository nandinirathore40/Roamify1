import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/')
    }
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={`crm-layout gemini-system-root ${isSidebarOpen ? 'gemini-expanded' : 'gemini-collapsed'}`}>

      {!isSidebarOpen && (
        <button className="gemini-main-toggle collapsed-trigger-btn" onClick={() => setIsSidebarOpen(true)}>
          <div className="gemini-bars-stack"><span></span><span></span><span></span><span></span></div>
        </button>
      )}

      {isSidebarOpen && (
        <button className="gemini-main-toggle expanded-trigger-btn" onClick={() => setIsSidebarOpen(false)}>
          <div className="gemini-bars-stack"><span></span><span></span><span></span><span></span></div>
        </button>
      )}

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-blue">✈</div>
          <div className="logo-text">
            <h2>SkyBook CRM</h2>
            <p>Travel Management</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${isActive('/dashboard')}`} onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
          <button className={`nav-item ${isActive('/new-booking')}`} onClick={() => navigate('/new-booking')}>🛫 New Booking</button>
          <button className={`nav-item ${isActive('/exchange')}`} onClick={() => navigate('/exchange')}>🔄 Exchange</button>
          <button className={`nav-item ${isActive('/future-credit')}`} onClick={() => navigate('/future-credit')}>💳 Future Credit</button>
          <button className={`nav-item ${isActive('/refund')}`} onClick={() => navigate('/refund')}>💵 Refund</button>

          {user?.role === 'manager' && (
            <button className="nav-item">👥 Admin Access</button>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{getInitials(user?.name)}</div>
            <div className="user-info">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.role === 'manager' ? 'Admin - Manager' : 'Agent'}</p>
            </div>
          </div>

          <button className="logout-btn-standalone" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout