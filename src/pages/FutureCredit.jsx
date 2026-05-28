import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout' // MASTER LAYOUT IMPORT
import './Dashboard.css' // Global layout spacing aur glass UI ke liye
import './FutureCredit.css'

const FutureCredit = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    originalTicket: '',
    customerName: '',
    airlineName: '',
    creditAmount: '',
    issueDate: '',
    expiryDate: '',
    customerEmail: '',
    notes: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const payload = {
      original_ticket_number: formData.originalTicket,
      customer_name: formData.customerName,
      airline_name: formData.airlineName,
      credit_amount: formData.creditAmount,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate,
      customer_email: formData.customerEmail,
      notes: formData.notes || ""
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/future-credits/', payload)
      if (response.status === 201) {
        alert("Future Credit Issued Successfully and Saved to Database!")
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Future Credit Error:", error.response?.data || error.message)
      alert("Error: Backend tak future credit request nahi pahonchi!")
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
      {/* Ye wrapper automatic spacing aur toggle gap handle karega */}
      <div className="dashboard-bg-container">
        
        {/* Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
            &lt; Back to Dashboard
          </Link>
        </div>
        
        {/* Header Section */}
        <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#10b981', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '32px', color: '#1e293b', margin: '0 0 4px 0', fontWeight: 'bold' }}>Future Credit</h1>
            <p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>Issue future travel credit for customer</p>
          </div>
        </header>

        {/* Form Box wrapped in Glass Card */}
        <div className="form-container" style={glassCardStyle}>
          <form onSubmit={handleSubmit}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Original Ticket Number</label>
                <input type="text" name="originalTicket" placeholder="e.g., TKT-2024-5678" value={formData.originalTicket} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Customer Name</label>
                <input type="text" name="customerName" placeholder="e.g., John Doe" value={formData.customerName} onChange={handleChange} required style={inputStyle} />
              </div>
              
              <div>
                <label style={labelStyle}>Airline Name</label>
                <input type="text" name="airlineName" placeholder="e.g., Qatar Airways" value={formData.airlineName} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Credit Amount</label>
                <input type="number" name="creditAmount" placeholder="$ 0.00" value={formData.creditAmount} onChange={handleChange} required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Issue Date</label>
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required style={inputStyle} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Customer Email</label>
                <input type="email" name="customerEmail" placeholder="customer@example.com" value={formData.customerEmail} onChange={handleChange} required style={inputStyle} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Notes / Terms & Conditions</label>
                <textarea name="notes" rows="4" placeholder="Enter any additional notes or terms..." value={formData.notes} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
              </div>
            </div>

            {/* Info Alert Box */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981', padding: '16px 20px', borderRadius: '8px', marginBottom: '32px' }}>
              <strong style={{ color: '#047857', display: 'block', marginBottom: '8px' }}>Credit Information:</strong>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#065f46', fontSize: '14px', lineHeight: '1.6' }}>
                <li>Credit can be used for future bookings with the same airline</li>
                <li>Non-transferable to other passengers</li>
                <li>Must be used before expiry date</li>
                <li>Customer will receive confirmation email</li>
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button type="button" onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: '#475569', border: '1px solid #94a3b8', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Issue Credit
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  )
}

export default FutureCredit