import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

// REVENUE CHART
const RevenueOverviewChart = () => {
  return (
    <div style={{ width: '100%', height: '260px', marginTop: '16px', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '22px', left: '48%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', zIndex: 10 }}>
        $635 <span style={{ color: '#94a3b8', fontWeight: '500', marginLeft: '2px' }}>12 Jul</span>
      </div>

      <div style={{ flex: 1, position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 600 160" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#e2e8f0" />

          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          <path d="M 10,110 C 60,110 50,125 100,125 C 150,125 140,85 200,85 C 250,85 240,40 290,40 C 340,40 350,105 400,105 C 450,105 440,75 500,75 C 550,75 540,100 590,100 L 590,160 L 10,160 Z" fill="url(#chartGradient)" />
          <path d="M 10,110 C 60,110 50,125 100,125 C 150,125 140,85 200,85 C 250,85 240,40 290,40 C 340,40 350,105 400,105 C 450,105 440,75 500,75 C 550,75 540,100 590,100" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />

          <circle cx="10" cy="110" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="100" cy="125" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="200" cy="85" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="290" cy="40" r="7" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
          <circle cx="290" cy="40" r="3" fill="#fff" />
          <circle cx="400" cy="105" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="500" cy="75" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="590" cy="100" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0 4px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <span key={idx} style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', width: '60px', textAlign: 'center' }}>
            {day}
          </span>
        ))}
      </div>
    </div>
  )
}

// MINI CALENDAR
const MiniCalendar = () => {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
        Calendar
      </h3>
      <p style={{ color: '#64748b', fontSize: '13px' }}>Flight schedule overview</p>
    </div>
  )
}

// MESSAGES PANEL
const MessagesPanel = () => {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', flex: 1 }}>
      <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
        Messages
      </h3>
      <p style={{ color: '#64748b', fontSize: '13px' }}>No new messages</p>
    </div>
  )
}

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
      <div style={{ padding: '32px 40px', backgroundColor: '#f4f7f9', minHeight: '100%', fontFamily: 'sans-serif' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>
              Dashboard
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500' }}>
              {user?.role === 'manager'
                ? 'Manager overview of all CRM operations'
                : 'Overview of your flight operations'}
            </p>
          </div>

          <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', width: '300px' }}>
            <span style={{ color: '#94a3b8' }}>🔍</span>
            <input type="text" placeholder="Search anything" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Total Bookings</p>
                <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
                  {loading ? '...' : bookings.length}
                </h3>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Total Exchanges</p>
                <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
                  {loading ? '...' : exchangesCount}
                </h3>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Total Refunds</p>
                <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>
                  {loading ? '...' : refundsCount}
                </h3>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                Revenue Overview
              </h3>
              <RevenueOverviewChart />
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                Recent Transactions
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>PNR</th>
                      <th style={{ padding: '12px 16px' }}>Customer</th>
                      <th style={{ padding: '12px 16px' }}>Type</th>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '16px', fontWeight: '700', color: '#3b82f6', fontSize: '13px' }}>
                            {b.pnr_number || 'N/A'}
                          </td>
                          <td style={{ padding: '16px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>
                            {b.passenger_name}
                          </td>
                          <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                            Booking
                          </td>
                          <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                            {new Date(b.booking_date).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#dcfce7', color: '#166534' }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '20px', color: '#64748b' }}>
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                Agent Credentials & Past Data
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 16px' }}>Agent Name</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Role</th>
                      <th style={{ padding: '12px 16px' }}>Total Bookings</th>
                      <th style={{ padding: '12px 16px' }}>Past Transactions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {agentSummary.length > 0 ? (
                      agentSummary.map((agent, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '16px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>
                            {agent.agent_name}
                          </td>
                          <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                            {agent.agent_email}
                          </td>
                          <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                            {agent.agent_role}
                          </td>
                          <td style={{ padding: '16px', color: '#334155', fontWeight: '700', fontSize: '13px' }}>
                            {agent.total_bookings}
                          </td>
                          <td style={{ padding: '16px' }}>
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
                        <td colSpan="5" style={{ padding: '20px', color: '#64748b' }}>
                          No agent data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <MiniCalendar />
            <MessagesPanel />

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                Future Credits
              </h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>
                Total issued: {loading ? '...' : creditsCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard