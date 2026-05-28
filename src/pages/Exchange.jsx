import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout' // MASTER LAYOUT IMPORT
import './Dashboard.css' // Global spacing aur layout apply karne ke liye
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

  const handleSubmit = async (e) => {
    e.preventDefault() 
    
    const payload = {
      old_ticket_number: formData.oldTicket,
      airline_name: formData.airlineName,
      pnr_number: formData.pnr,
      exchange_fee: formData.exchangeFee || 0.00,
      new_departure_city: formData.newDepartureCity,
      new_arrival_city: formData.newArrivalCity,
      new_departure_date: formData.newDepartureDate,
      new_return_date: formData.newReturnDate || null, 
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

  // Dashboard wala same Premium Glassmorphism Theme
  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
    borderRadius: "16px",
    padding: "32px"
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px', 
    border: '1px solid rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.85)', 
    color: '#1e293b', fontSize: '14px', outline: 'none'
  }

  const labelStyle = {
    display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: 600
  }

  return (
    <Layout>
      {/* Ye class usko Dashboard aur New Booking jaisa gap degi aur toggle trigger support karegi */}
      <div className="dashboard-bg-container">
        
        {/* Header Section */}
        <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#a855f7', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '32px', color: '#1e293b', margin: '0 0 4px 0', fontWeight: 'bold' }}>Exchange Ticket</h1>
            <p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>Process ticket exchange for existing booking</p>
          </div>
        </header>

        {/* Form Box wrapped in Glass Card */}
        <div className="form-container" style={glassCardStyle}>
          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Old Ticket Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle}>Old Ticket Number</label>
                <input type="text" name="oldTicket" placeholder="e.g., TKT-2024-1234" value={formData.oldTicket} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Airline Name</label>
                <input type="text" name="airlineName" placeholder="e.g., Emirates" value={formData.airlineName} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>PNR Number</label>
                <input type="text" name="pnr" placeholder="6-digit PNR" value={formData.pnr} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Exchange Fee</label>
                <input type="number" name="exchangeFee" placeholder="$ 0.00" value={formData.exchangeFee} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', marginBottom: '32px' }} />

            {/* Section 2: New Details */}
            <h3 style={{ fontSize: '18px', color: '#1e293b', fontWeight: 'bold', marginBottom: '20px' }}>New Flight Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle}>New Departure City</label>
                <input type="text" name="newDepartureCity" placeholder="e.g., New York (JFK)" value={formData.newDepartureCity} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>New Arrival City</label>
                <input type="text" name="newArrivalCity" placeholder="e.g., London (LHR)" value={formData.newArrivalCity} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>New Departure Date</label>
                <input type="date" name="newDepartureDate" value={formData.newDepartureDate} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>New Return Date</label>
                <input type="date" name="newReturnDate" value={formData.newReturnDate} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Section 3: Reason */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Exchange Reason</label>
              <textarea name="exchangeReason" rows="3" placeholder="Enter reason for flight exchange..." value={formData.exchangeReason} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical' }}></textarea>
            </div>

            {/* Submit Action */}
            <div style={{ textAlign: 'right' }}>
              <button type="submit" style={{ background: '#a855f7', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                Process Exchange
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  )
}

export default Exchange