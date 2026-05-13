import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Exchange.css'

const Exchange = () => {
  const navigate = useNavigate()

  // Updated state based on the new UI design
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

  const handleSubmit = (e) => {
    e.preventDefault() // Form reload rokne ke liye
    console.log("Exchange Submitted:", formData)
    alert("Exchange Request Processed Successfully!")
    navigate('/dashboard')
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
        
        {/* Header Section */}
        <header className="page-header exchange-header">
          <div className="header-icon purple-bg">
            🔄
          </div>
          <div>
            <h1>Exchange Ticket</h1>
            <p>Process ticket exchange for existing booking</p>
          </div>
        </header>

        {/* Form Area */}
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