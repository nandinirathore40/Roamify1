import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [exchangesCount, setExchangesCount] = useState(0)
  const [refundsCount, setRefundsCount] = useState(0)
  const [creditsCount, setCreditsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, exchangesRes, refundsRes, creditsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/bookings/'),
          axios.get('http://127.0.0.1:8000/api/exchanges/'),
          axios.get('http://127.0.0.1:8000/api/refunds/'),
          axios.get('http://127.0.0.1:8000/api/future-credits/')
        ])

        let bookingsData = bookingsRes.data
        let exchangesData = exchangesRes.data
        let refundsData = refundsRes.data
        let creditsData = creditsRes.data

        if (user?.role !== 'manager') {
          bookingsData = bookingsData.filter(item => Number(item.agent) === Number(user.id))
          exchangesData = exchangesData.filter(item => Number(item.agent) === Number(user.id))
          refundsData = refundsData.filter(item => Number(item.agent) === Number(user.id))
          creditsData = creditsData.filter(item => Number(item.agent) === Number(user.id))
        }

        setBookings(bookingsData)
        setExchangesCount(exchangesData.length)
        setRefundsCount(refundsData.length)
        setCreditsCount(creditsData.length)
        setLoading(false)
      } catch (error) {
        console.error('Dashboard data fetch error:', error)
        setLoading(false)
      }
    }

    if (user) fetchDashboardData()
  }, [user])

  const agentSummary = Object.values(
    bookings.reduce((acc, booking) => {
      const key = booking.agent_email || booking.agent_name || 'unknown'

      if (!acc[key]) {
        acc[key] = {
          agent_name: booking.agent_name || 'Unknown Agent',
          agent_email: booking.agent_email || 'No Email',
          agent_role: booking.agent_role || 'Agent',
          total_bookings: 0,
          transactions: []
        }
      }

      acc[key].total_bookings += 1
      acc[key].transactions.push(booking)

      return acc
    }, {})
  )

  return (
    <Layout>
      <div className="dashboard-glass-wrapper">

        <div className="dash-header">
          <h2>
            Welcome back, {user?.role === 'manager' ? 'Manager' : 'Agent'}!
          </h2>
          <p>
            {user?.role === 'manager'
              ? 'Full CRM overview with all agent transactions.'
              : 'Here is your personal CRM activity.'}
          </p>
        </div>

        <div className="glass-kpi-grid">
          <div className="glass-card">
            <span className="kpi-icon">📋</span>
            <div>
              <h3>{loading ? '...' : bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="glass-card">
            <span className="kpi-icon">🔄</span>
            <div>
              <h3>{loading ? '...' : exchangesCount}</h3>
              <p>Exchanges</p>
            </div>
          </div>

          <div className="glass-card">
            <span className="kpi-icon">💵</span>
            <div>
              <h3>{loading ? '...' : refundsCount}</h3>
              <p>Refunds</p>
            </div>
          </div>

          <div className="glass-card">
            <span className="kpi-icon">💳</span>
            <div>
              <h3>{loading ? '...' : creditsCount}</h3>
              <p>Future Credits</p>
            </div>
          </div>
        </div>

        <div className="glass-main-split">
          <div className="glass-panel table-panel">
            <div className="panel-header">
              <h3>Recent Transactions</h3>
              <button className="glass-btn">View All</button>
            </div>

            <table className="glass-table">
              <thead>
                <tr>
                  <th>PNR</th>
                  <th>Customer Name</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-bold">{b.pnr_number || 'N/A'}</td>
                      <td>{b.passenger_name}</td>
                      <td>Booking</td>
                      <td>
                        <span className={`status-badge ${b.status?.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="glass-panel alerts-panel">
            <h3>Action Required</h3>

            <div className="glass-alert red-alert">
              <strong>🔴 Payment Timeout</strong>
              <p>Pending verification records require review.</p>
            </div>

            <div className="glass-alert orange-alert">
              <strong>🟠 Schedule Change</strong>
              <p>Check airline schedule updates.</p>
            </div>

            <div className="glass-alert blue-alert">
              <strong>🔵 System Update</strong>
              <p>CRM data synced with backend.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel table-panel" style={{ marginTop: '24px' }}>
          <div className="panel-header">
            <h3>Agent Credentials & Past Data</h3>
          </div>

          <table className="glass-table">
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Total Bookings</th>
                <th>Past Transactions</th>
              </tr>
            </thead>

            <tbody>
              {agentSummary.length > 0 ? (
                agentSummary.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.agent_name}</td>
                    <td>{agent.agent_email}</td>
                    <td>{agent.agent_role}</td>
                    <td>{agent.total_bookings}</td>
                    <td>
                      <button
                        className="table-action-btn"
                        onClick={() => {
                          const transactionDetails = agent.transactions
                            .map((t, i) => `
Transaction ${i + 1}
Passenger: ${t.passenger_name}
PNR: ${t.pnr_number || 'N/A'}
Status: ${t.status}
Date: ${new Date(t.booking_date).toLocaleString()}
`)
                            .join('\n----------------------\n')

                          alert(`
Agent Name: ${agent.agent_name}
Email: ${agent.agent_email}
Role: ${agent.agent_role}
Total Bookings: ${agent.total_bookings}

Past Transactions:
${transactionDetails}
                          `)
                        }}
                      >
                         View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No agent data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}

export default Dashboard