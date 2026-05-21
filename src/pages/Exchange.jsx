import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // AXIOS IMPORT KIYA
import './Exchange.css'

const Exchange = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    oldTicket: '',
    airlineName: '',
    pnr: '',
    exchangeFee: '',
    newDepartureCity: '',
    newArrivalCity: '',
    newDepartureDate: '',
    newReturnDate: '',
    exchangeReason: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // UPDATED HANDLESUBMIT WITH AXIOS POST
  const handleSubmit = async (e) => {
    e.preventDefault() // Form reload rokne ke liye
    
    // Django ke models ke fields ke hissab se payload taiyar kiya
    const payload = {
      old_ticket_number: formData.oldTicket,
      airline_name: formData.airlineName,
      pnr_number: formData.pnr,
      exchange_fee: formData.exchangeFee || 0.00,
      new_departure_city: formData.newDepartureCity,
      new_arrival_city: formData.newArrivalCity,
      new_departure_date: formData.newDepartureDate,
      new_return_date: formData.newReturnDate || null, // Optional field
      exchange_reason: formData.exchangeReason
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/exchanges/', payload)
      if (response.status === 201) {
        alert("Success! Ticket Exchange request database mein save ho gayi.")
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Exchange Submission Error:", error.response?.data || error.message)
      alert("Error: Backend tak request nahi pahonchi!")
    }
  }

  return (
    <div className="crm-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-blue">✈</div>
          <div className="logo-text">
            <h2>SkyBook CRM</h2>
            <p>Travel Management</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
          <button className="nav-item" onClick={() => navigate('/new-booking')}>🛫 New Booking</button>
          <button className="nav-item active">🔄 Exchange</button>
          <button className="nav-item" onClick={() => navigate('/future-credit')}>💳 Future Credit</button>
          <button className="nav-item" onClick={() => navigate('/refund')}>💵 Refund</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="page-header exchange-header">
          <div className="header-icon purple-bg">🔄</div>
          <div>
            <h1>Exchange Ticket</h1>
            <p>Process ticket exchange for existing booking</p>
          </div>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Old Ticket Details */}
            <div className="form-grid">
              <div className="input-group">
                <label>Old Ticket Number</label>
                <input 
                  type="text" 
                  name="oldTicket" 
                  placeholder="e.g., TKT-2024-1234" 
                  value={formData.oldTicket} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Airline Name</label>
                <input 
                  type="text" 
                  name="airlineName" 
                  placeholder="e.g., Emirates" 
                  value={formData.airlineName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>PNR Number</label>
                <input 
                  type="text" 
                  name="pnr" 
                  placeholder="6-digit PNR" 
                  value={formData.pnr} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Exchange Fee</label>
                <div className="input-with-prefix">
                  <span className="prefix">$</span>
                  <input 
                    type="number" 
                    name="exchangeFee" 
                    placeholder="0.00" 
                    value={formData.exchangeFee} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Section 2: New Flight Details */}
            <h3 className="section-subtitle">New Flight Details</h3>
            
            <div className="form-grid">
              <div className="input-group">
                <label>New Departure City</label>
                <input 
                  type="text" 
                  name="newDepartureCity" 
                  placeholder="e.g., New York (JFK)" 
                  value={formData.newDepartureCity} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>New Arrival City</label>
                <input 
                  type="text" 
                  name="newArrivalCity" 
                  placeholder="e.g., London (LHR)" 
                  value={formData.newArrivalCity} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>New Departure Date</label>
                <input 
                  type="date" 
                  name="newDepartureDate" 
                  value={formData.newDepartureDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>New Return Date</label>
                <input 
                  type="date" 
                  name="newReturnDate" 
                  value={formData.newReturnDate} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="input-group full-width">
                <label>Exchange Reason</label>
                <textarea 
                  name="exchangeReason" 
                  rows="3" 
                  placeholder="Enter reason for flight exchange..." 
                  value={formData.exchangeReason} 
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" style={{ backgroundColor: '#a855f7' }}>
                Process Exchange
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Exchange