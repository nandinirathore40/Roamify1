import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout'; 
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';



const RevenueOverviewChart = () => {
  return (
    <div style={{ width: '100%', height: '260px', marginTop: '16px', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Tooltip over the peak milestone */}
      <div style={{ position: 'absolute', top: '22px', left: '48%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        $635 <span style={{ color: '#94a3b8', fontWeight: '500', marginLeft: '2px' }}>12 Jul</span>
      </div>

      {/* Main SVG Graph Canvas */}
      <div style={{ flex: 1, position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 600 160" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          
          {/* Horizontal Grid Lines */}
          <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#e2e8f0" />

          {/* Smooth Gradient Area Fill Under Curve */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
            </linearGradient>
          </defs>
          <path 
            d="M 10,110 C 60,110 50,125 100,125 C 150,125 140,85 200,85 C 250,85 240,40 290,40 C 340,40 350,105 400,105 C 450,105 440,75 500,75 C 550,75 540,100 590,100 L 590,160 L 10,160 Z" 
            fill="url(#chartGradient)" 
          />

          {/* Main Royal Blue Spline Wave Line */}
          <path 
            d="M 10,110 C 60,110 50,125 100,125 C 150,125 140,85 200,85 C 250,85 240,40 290,40 C 340,40 350,105 400,105 C 450,105 440,75 500,75 C 550,75 540,100 590,100" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />

          {/* Dynamic Interactive Node Circles */}
          <circle cx="10" cy="110" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="100" cy="125" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="200" cy="85" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          
          {/* Peak Value Pulse Node */}
          <circle cx="290" cy="40" r="7" fill="#3b82f6" stroke="#fff" strokeWidth="2" style={{ filter: 'drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.4))' }} />
          <circle cx="290" cy="40" r="3" fill="#fff" />

          <circle cx="400" cy="105" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="500" cy="75" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="590" cy="100" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
        </svg>
      </div>

      {/* X-Axis Labels matched exactly with the graph grid splits */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0 4px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <span key={idx} style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', width: '60px', textAlign: 'center' }}>{day}</span>
        ))}
      </div>
    </div>
  );
};


const MOCK_EVENTS = {
  "15-5-2026": [
    { pnr: "X8F92A", route: "DEL ➔ BOM", time: "10:30 AM", status: "Confirmed", pax: "Rahul Sharma" }
  ],
  "18-5-2026": [
    { pnr: "Y2M11K", route: "BLR ➔ CCU", time: "06:15 PM", status: "Pending", pax: "Anita Desai" },
    { pnr: "Z9P44L", route: "BOM ➔ DXB", time: "11:45 PM", status: "Confirmed", pax: "John Doe" }
  ]
};

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); 
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDay).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (day) => {
    return day === 1 && month === 5 && year === 2026;
  };

  const handleDateClick = (day) => {
    const dateKey = `${day}-${month}-${year}`;
    const events = MOCK_EVENTS[dateKey] || [];
    setSelectedDateEvents({ date: `${day} ${monthNames[month]} ${year}`, events });
    setIsModalOpen(true);
  };

  return (
    <div style={{ width: '100%', fontFamily: 'sans-serif' }}>
      
      {/* Event Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '800' }}>📅 {selectedDateEvents.date}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}>✖</button>
            </div>
            
            {selectedDateEvents.events.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedDateEvents.events.map((ev, i) => (
                  <div key={i} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '800', color: '#3b82f6' }}>{ev.route}</span>
                      <span style={{ fontSize: '12px', color: ev.status === 'Confirmed' ? '#166534' : '#92400e', background: ev.status === 'Confirmed' ? '#dcfce7' : '#fef3c7', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>{ev.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                      <span>👤 {ev.pax}</span>
                      <span>🕒 {ev.time}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontWeight: '600' }}>PNR: {ev.pnr}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✈️</div>
                <div style={{ fontWeight: '600' }}>No flights scheduled</div>
                <div style={{ fontSize: '12px' }}>No bookings found for this date.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar UI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>
          {monthNames[month]} {year} ⌄
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}
          >
            {'<'}
          </button>

          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}
          >
            {'>'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
        {daysOfWeek.map((day, idx) => (
          <div key={idx} style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>{day}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {blanks.map((_, idx) => (
          <div key={`blank-${idx}`} style={{ padding: '8px 0' }}></div>
        ))}
        {daysArray.map((day) => {
          const dateKey = `${day}-${month}-${year}`;
          const hasEvent = MOCK_EVENTS[dateKey]?.length > 0;
          
          return (
            <div 
              key={day} 
              onClick={() => handleDateClick(day)}
              style={{ 
                padding: '6px 0', 
                fontSize: '13px', 
                fontWeight: '600',
                color: isToday(day) ? '#fff' : '#334155',
                background: isToday(day) ? '#3b82f6' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if(!isToday(day)) {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseOut={(e) => {
                if(!isToday(day)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {day}
              {hasEvent && (
                <div style={{ width: '4px', height: '4px', background: isToday(day) ? '#fff' : '#3b82f6', borderRadius: '50%', marginTop: '2px' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


const flightMessages = [
  { id: 1, name: "Indigo API Support", initials: "IN", time: "10:05 AM", preview: "Scheduled downtime tonight at 2 AM...", unread: true, color: "#dbeafe", text: "#1d4ed8" },
  { id: 2, name: "Rahul (B2B Agent)", initials: "RA", time: "2:35 PM", preview: "Please process the refund for PNR X8F9...", unread: true, color: "#d1fae5", text: "#065f46" },
  { id: 3, name: "Priya Sharma", initials: "PS", time: "3:48 PM", preview: "Hi, I need assistance with my baggage limit...", unread: false, color: "#fae8ff", text: "#7e22ce" },
  { id: 4, name: "Accounts Dept", initials: "AC", time: "4:12 PM", preview: "Weekly settlement invoice generated.", unread: false, color: "#fef9c3", text: "#854d0e" },
];

const MessagesPanel = () => {
  const [active, setActive] = useState(null);
  const unreadCount = flightMessages.filter(m => m.unread).length;

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', flex: 1, fontFamily: 'sans-serif' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>Messages</h3>
          {unreadCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#3b82f6", color: "white", borderRadius: 20, padding: "2px 8px" }}>
              {unreadCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: "#3b82f6", cursor: "pointer", fontWeight: 600 }}>View All</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {flightMessages.map(msg => (
          <div
            key={msg.id}
            onClick={() => setActive(active === msg.id ? null : msg.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px", borderRadius: "8px", cursor: "pointer",
              background: active === msg.id ? "#f8fafc" : "transparent",
              transition: "background 0.2s"
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: msg.color, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 700, color: msg.text
            }}>
              {msg.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                <span style={{ fontSize: 13, fontWeight: msg.unread ? 700 : 600, color: "#0f172a" }}>{msg.name}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{msg.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {msg.unread && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />}
                <div style={{
                  fontSize: 12, color: "#64748b",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {msg.preview}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [exchangesCount, setExchangesCount] = useState(0)
  const [refundsCount, setRefundsCount] = useState(0)
  const [creditsCount, setCreditsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [selectedAgent, setSelectedAgent] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedChatUser, setSelectedChatUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')

  const [bookingForm, setBookingForm] = useState({
    passenger_name: '',
    passenger_email: '',
    pnr_number: '',
    seats_booked: '',
    total_amount: '',
    status: 'Confirmed',
  })

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, exchangesRes, refundsRes, creditsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/bookings/'),
        axios.get('http://127.0.0.1:8000/api/exchanges/'),
        axios.get('http://127.0.0.1:8000/api/refunds/'),
        axios.get('http://127.0.0.1:8000/api/future-credits/'),
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/')
      setUsers(response.data.filter((u) => Number(u.id) !== Number(user.id)))
    } catch (error) {
      console.error('Users fetch error:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/messages/?user_id=${user.id}`
      )
      setMessages(response.data)
    } catch (error) {
      console.error('Messages fetch error:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData()
      fetchUsers()
      fetchMessages()
    }
  }, [user])

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking)
    setBookingForm({
      passenger_name: booking.passenger_name || '',
      passenger_email: booking.passenger_email || '',
      pnr_number: booking.pnr_number || '',
      seats_booked: booking.seats_booked || '',
      total_amount: booking.total_amount || '',
      status: booking.status || 'Pending',
    })
  }

  const handleUpdateBooking = async () => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/bookings/${selectedBooking.id}/`,
        bookingForm
      )

      setBookings((prev) =>
        prev.map((item) =>
          item.id === selectedBooking.id ? response.data : item
        )
      )

      setSelectedBooking(null)
      alert('Booking updated successfully!')
    } catch (error) {
      console.error('Booking update error:', error.response?.data || error.message)
      alert('Error updating booking.')
    }
  }

  const sendMessage = async () => {
    if (!selectedChatUser || !newMessage.trim()) return

    try {
      await axios.post('http://127.0.0.1:8000/api/messages/', {
        sender: user.id,
        receiver: selectedChatUser.id,
        text: newMessage,
        is_read: false,
      })

      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Send message error:', error.response?.data || error.message)
      alert('Message not sent.')
    }
  }

  const selectedChatMessages = selectedChatUser
    ? messages.filter((msg) =>
        (Number(msg.sender) === Number(user.id) && Number(msg.receiver) === Number(selectedChatUser.id)) ||
        (Number(msg.receiver) === Number(user.id) && Number(msg.sender) === Number(selectedChatUser.id))
      )
    : []

  const agentSummary = Object.values(
    bookings.reduce((acc, booking) => {
      const key = booking.agent_email || booking.agent_name || 'unknown'

      if (!acc[key]) {
        acc[key] = {
          agent_name: booking.agent_name || 'Unknown Agent',
          agent_email: booking.agent_email || 'No Email',
          agent_role: booking.agent_role || 'Agent',
          total_bookings: 0,
          transactions: [],
        }
      }

      acc[key].total_bookings += 1
      acc[key].transactions.push(booking)

      return acc
    }, {})
  )

  const recentTransactions = bookings.filter((booking) => {
    if (!booking.booking_date) return false

    const bookingDate = new Date(booking.booking_date)
    const now = new Date()
    const diffHours = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60)

    return diffHours <= 24
  })

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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📅</div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Total Bookings</p>
                      <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>1,200</h3>
                    </div>
                  </div>
                  <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>+2.98%</span>
                </div>
              </div>
              
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👥</div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>New Customers</p>
                      <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>2,845</h3>
                    </div>
                  </div>
                  <span style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>-1.45%</span>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>💲</div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Total Earnings</p>
                      <h3 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>$12,890</h3>
                    </div>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#22c55e', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>+3.75%</span>
                </div>
              </div>
            </div>

            {/* ROW 2: FULL WIDTH REVENUE CHART BLOCK */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>Revenue Overview</h3>
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Weekly ⌄</span>
              </div>
              
              {/* Embedded Spline Line Chart (Now Full Width) */}
              <RevenueOverviewChart />
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>Recent Transactions</h3>
                <span style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>Sort by: <strong style={{ color: '#0f172a' }}>Latest ⌄</strong></span>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    {user?.role === 'manager' ? (
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>SR No.</th>
                        <th style={{ padding: '12px 16px' }}>Agent Name</th>
                        <th style={{ padding: '12px 16px' }}>Email</th>
                        <th style={{ padding: '12px 16px' }}>Role</th>
                        <th style={{ padding: '12px 16px' }}>Total Bookings</th>
                        <th style={{ padding: '12px 16px' }}>Past Transactions</th>
                      </tr>
                    ) : (
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>SR No.</th>
                        <th style={{ padding: '12px 16px' }}>Customer Name</th>
                        <th style={{ padding: '12px 16px' }}>PNR</th>
                        <th style={{ padding: '12px 16px' }}>Email</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Action</th>
                      </tr>
                    )}
                  </thead>

                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px', fontWeight: '700', color: '#3b82f6', fontSize: '13px' }}>X8F92A</td>
                      <td style={{ padding: '16px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#3b82f6', fontWeight: 'bold' }}>RS</div>
                          Rahul Sharma
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Booking</td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>01 Jun, 2026</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#dcfce7', color: '#166534' }}>Confirmed</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px', fontWeight: '700', color: '#3b82f6', fontSize: '13px' }}>P2M45K</td>
                      <td style={{ padding: '16px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#3b82f6', fontWeight: 'bold' }}>AD</div>
                          Anita Desai
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Refund</td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>31 May, 2026</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: '#fef3c7', color: '#92400e' }}>Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* INTERACTIVE CALENDAR */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                Future Credits
              </h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>
                Total issued: {loading ? '...' : creditsCount}
              </p>
            </div>

            {/* MESSAGES PANEL */}
            <MessagesPanel />

          </div>
        </div>
      </div>

      {selectedAgent && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <div className="details-modal-header">
              <div>
                <h3>Agent Transaction Details</h3>
                <p>{selectedAgent.agent_name}</p>
              </div>

              <button className="details-close-btn" onClick={() => setSelectedAgent(null)}>
                ✕
              </button>
            </div>

            <div className="details-agent-info">
              <p><strong>Agent Name:</strong> {selectedAgent.agent_name}</p>
              <p><strong>Email:</strong> {selectedAgent.agent_email}</p>
              <p><strong>Role:</strong> {selectedAgent.agent_role}</p>
              <p><strong>Total Bookings:</strong> {selectedAgent.total_bookings}</p>
            </div>

            <div className="details-transaction-list">
              {selectedAgent.transactions.length > 0 ? (
                selectedAgent.transactions.map((t, index) => (
                  <div className="details-transaction-card" key={index}>
                    <h4>Transaction {index + 1}</h4>
                    <p><strong>Passenger:</strong> {t.passenger_name}</p>
                    <p><strong>PNR:</strong> {t.pnr_number || 'N/A'}</p>
                    <p><strong>Email:</strong> {t.passenger_email || 'Not Provided'}</p>
                    <p><strong>Status:</strong> {t.status}</p>
                    <p><strong>Date:</strong> {new Date(t.booking_date).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  No transactions found for this agent.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <div className="details-modal-header">
              <div>
                <h3>Customer Booking Details</h3>
                <p>{selectedBooking.passenger_name}</p>
              </div>

              <button className="details-close-btn" onClick={() => setSelectedBooking(null)}>
                ✕
              </button>
            </div>

            <div className="details-agent-info">
              <p><strong>Passenger:</strong> {selectedBooking.passenger_name}</p>
              <p><strong>PNR:</strong> {selectedBooking.pnr_number || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedBooking.passenger_email || 'Not Provided'}</p>
              <p><strong>Seats Booked:</strong> {selectedBooking.seats_booked || 'Not Provided'}</p>
              <p><strong>Total Amount:</strong> {selectedBooking.total_amount || 'Not Provided'}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.booking_date).toLocaleString()}</p>
            </div>

            {selectedBooking.status === 'Confirmed' ? (
              <div className="confirmed-box">
                ✅ This booking is already confirmed.
              </div>
            ) : (
              <div className="confirm-form-box">
                <h4>Complete Booking Confirmation</h4>

                <div className="confirm-form-grid">
                  <div className="confirm-form-field">
                    <label>Passenger Name</label>
                    <input
                      type="text"
                      value={bookingForm.passenger_name}
                      onChange={(e) => setBookingForm({ ...bookingForm, passenger_name: e.target.value })}
                      placeholder="Passenger name"
                    />
                  </div>

                  <div className="confirm-form-field">
                    <label>Passenger Email</label>
                    <input
                      type="email"
                      value={bookingForm.passenger_email}
                      onChange={(e) => setBookingForm({ ...bookingForm, passenger_email: e.target.value })}
                      placeholder="Passenger email"
                    />
                  </div>

                  <div className="confirm-form-field">
                    <label>PNR Number</label>
                    <input
                      type="text"
                      value={bookingForm.pnr_number}
                      onChange={(e) => setBookingForm({ ...bookingForm, pnr_number: e.target.value })}
                      placeholder="PNR number"
                    />
                  </div>

                  <div className="confirm-form-field">
                    <label>Seats Booked</label>
                    <input
                      type="number"
                      value={bookingForm.seats_booked}
                      onChange={(e) => setBookingForm({ ...bookingForm, seats_booked: e.target.value })}
                      placeholder="Seats booked"
                    />
                  </div>

                  <div className="confirm-form-field">
                    <label>Total Amount</label>
                    <input
                      type="number"
                      value={bookingForm.total_amount}
                      onChange={(e) => setBookingForm({ ...bookingForm, total_amount: e.target.value })}
                      placeholder="Total amount"
                    />
                  </div>

                  <div className="confirm-form-field">
                    <label>Status</label>
                    <select
                      value={bookingForm.status}
                      onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <button className="confirm-booking-btn" onClick={handleUpdateBooking}>
                  Update & Confirm Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedChatUser && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <div className="details-modal-header">
              <div>
                <h3>Chat with {selectedChatUser.username}</h3>
                <p>{selectedChatUser.email}</p>
              </div>

              <button className="details-close-btn" onClick={() => setSelectedChatUser(null)}>
                ✕
              </button>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', background: '#f8fafc', borderRadius: '12px', marginBottom: '14px' }}>
              {selectedChatMessages.length > 0 ? (
                selectedChatMessages.map((msg) => {
                  const isMine = Number(msg.sender) === Number(user.id)

                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: isMine ? '#3b82f6' : '#ffffff',
                          color: isMine ? '#ffffff' : '#334155',
                          border: isMine ? 'none' : '1px solid #e2e8f0',
                          fontSize: '13px',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  No messages yet.
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />

              <button className="table-action-btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Dashboard