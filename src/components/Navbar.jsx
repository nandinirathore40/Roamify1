import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        ✈ Flight Booking
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
        <NavLink to="/new-booking" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>New Booking</NavLink>
        <NavLink to="/exchange" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Exchange</NavLink>
        <NavLink to="/future-credit" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Future Credit</NavLink>
        <NavLink to="/refund" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Refund</NavLink>
      </div>

      <div className="navbar-user">
        <span className="user-badge">{user?.role === 'manager' ? '🛡 Manager' : '🎧 Agent'}</span>
        <span className="user-name">{user?.name}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar