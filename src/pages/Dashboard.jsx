import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'
import Layout from '../components/Layout'

const Dashboard = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Backend se data fetch karne ke liye
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/bookings/')
        setBookings(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Dashboard error:", error)
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <Layout>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </header>

      {/* KPI Grid - Ab ye asali data dikhayega */}
      <section className="kpi-metrics-grid">
        <div className="kpi-card-new">
          <div className="kpi-top">
            <div className="icon-wrap bg-blue-light text-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path><line x1="3" y1="21" x2="21" y2="21"></line></svg>
            </div>
          </div>
          {/* ASALI COUNT YAHAN HAI */}
          <h2>{loading ? "..." : bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        {/* Baki cards abhi static rehne do jab tak backend logic complete na ho */}
        <div className="kpi-card-new">
           {/* ... baki cards ... */}
           <h2>8</h2>
           <p>Pending Refunds</p>
        </div>
      </section>

      <h3 className="section-title">Quick Actions</h3>
      <section className="quick-actions-blocks">
        <div className="action-block bg-blue" onClick={() => navigate('/new-booking')}>
          <h4>New Booking</h4>
          <p>Create new</p>
        </div>
        {/* ... baki action blocks ... */}
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
                    <td><span className="status-badge">{b.status}</span></td>
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