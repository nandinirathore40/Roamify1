import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import Layout from '../components/Layout' // Shared Sidebar logic yahan hai

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      {/* ---------------- MAIN CONTENT ONLY ---------------- */}
      {/* Sidebar delete kar diya kyunki wo Layout ke andar hai */}
      
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </header>

      {/* KPI Grid */}
      <section className="kpi-metrics-grid">
        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-blue-light text-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path><line x1="3" y1="21" x2="21" y2="21"></line></svg>
            </div>
            <span className="trend positive">↗ +12%</span>
          </div>
          <h2>24</h2>
          <p>Today's Bookings</p>
        </div>

        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-orange-light text-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <span className="trend negative">↙ -3%</span>
          </div>
          <h2>8</h2>
          <p>Pending Refunds</p>
        </div>

        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-purple-light text-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            </div>
            <span className="trend positive">↗ +2</span>
          </div>
          <h2>5</h2>
          <p>Pending Exchanges</p>
        </div>

        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-green-light text-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <h2>12</h2>
          <p>Active Agents</p>
          <span className="subtext">2 online</span>
        </div>
      </section>

      {/* Quick Actions Title */}
      <h3 className="section-title">Quick Actions</h3>

      {/* Quick Actions Grid */}
      <section className="quick-actions-blocks">
        <div className="action-block bg-blue" onClick={() => navigate('/new-booking')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path><line x1="3" y1="21" x2="21" y2="21"></line></svg>
          <h4>New Booking</h4>
          <p>Create new</p>
        </div>

        <div className="action-block bg-purple" onClick={() => navigate('/exchange')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
          <h4>Exchange</h4>
          <p>Create new</p>
        </div>

        <div className="action-block bg-green" onClick={() => navigate('/future-credit')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          <h4>Future Credit</h4>
          <p>Create new</p>
        </div>

        <div className="action-block bg-orange" onClick={() => navigate('/refund')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
          <h4>Refund</h4>
          <p>Create new</p>
        </div>
      </section>

      {/* Transactions Table Area */}
      <section className="transactions-container">
        <div className="table-header-row">
          <h3>Recent Transactions</h3>
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search transactions..." />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Dashboard