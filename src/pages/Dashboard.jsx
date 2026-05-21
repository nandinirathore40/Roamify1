import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'
import Layout from '../components/Layout'

const Dashboard = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [exchangesCount, setExchangesCount] = useState(0)
  const [refundsCount, setRefundsCount] = useState(0)
  const [creditsCount, setCreditsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Concurrent API Calls se saara data ek sath fetch karne ke liye
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, exchangesRes, refundsRes, creditsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/bookings/'),
          axios.get('http://127.0.0.1:8000/api/exchanges/'),
          axios.get('http://127.0.0.1:8000/api/refunds/'),
          axios.get('http://127.0.0.1:8000/api/future-credits/')
        ])

        setBookings(bookingsRes.data)
        setExchangesCount(exchangesRes.data.length)
        setRefundsCount(refundsRes.data.length)
        setCreditsCount(creditsRes.data.length)
        setLoading(false)
      } catch (error) {
        console.error("Dashboard data fetch error:", error)
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <Layout>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </header>

      {/* KPI Grid - AB SAARE COUNTS REAL-TIME HAIN */}
      <section className="kpi-metrics-grid">
        {/* TOTAL BOOKINGS */}
        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-blue-light text-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path><line x1="3" y1="21" x2="21" y2="21"></line></svg>
            </div>
          </div>
          <h2>{loading ? "..." : bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        {/* ACTIVE EXCHANGES */}
        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-purple-light text-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            </div>
          </div>
          <h2>{loading ? "..." : exchangesCount}</h2>
          <p>Total Exchanges</p>
        </div>

        {/* TOTAL REFUNDS */}
        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-orange-light text-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <h2>{loading ? "..." : refundsCount}</h2>
          <p>Total Refunds</p>
        </div>

        {/* FUTURE CREDITS */}
        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-green-light text-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
          </div>
          <h2>{loading ? "..." : creditsCount}</h2>
          <p>Future Credits Issued</p>
        </div>
      </section>

      <h3 className="section-title">Quick Actions</h3>
      <section className="quick-actions-blocks">
        <div className="action-block bg-blue" onClick={() => navigate('/new-booking')}>
          <h4>New Booking</h4>
          <p>Create booking</p>
        </div>
        <div className="action-block bg-purple" onClick={() => navigate('/exchange')}>
          <h4>Exchange Ticket</h4>
          <p>Process exchange</p>
        </div>
        <div className="action-block bg-orange" onClick={() => navigate('/refund')}>
          <h4>Refund Request</h4>
          <p>Process refund</p>
        </div>
        <div className="action-block bg-green" onClick={() => navigate('/future-credit')}>
          <h4>Future Credit</h4>
          <p>Issue credit</p>
        </div>
      </section>

      {/* Transactions Table - ASALI DATA LIST */}
      <section className="transactions-container">
        <div className="table-header-row">
          <h3>Recent Transactions</h3>
        </div>
        
        <div className="custom-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Passenger</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.passenger_name}</strong></td>
                    <td><span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                    <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No bookings found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  )
}

export default Dashboard