import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // AXIOS IMPORT KIYA
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

  // UPDATED HANDLESUBMIT WITH AXIOS POST
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Django ke model ke variable names ke mutabiq payload banaya
    const payload = {
      original_ticket_number: formData.originalTicket,
      customer_name: formData.customerName,
      airline_name: formData.airlineName,
      credit_amount: formData.creditAmount,
      issue_date: formData.issueDate,
      expiry_date: formData.expiryDate,
      customer_email: formData.customerEmail,
      notes: formData.notes || "" // Optional field handling
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

  return (
    <div className="crm-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" opacity="0"></path><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path><line x1="8" y1="21" x2="16" y2="21"></line></svg>
          </div>
          <div className="logo-text">
            <h2>SkyBook CRM</h2>
            <p>Travel Management</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/new-booking')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path></svg>
            New Booking
          </button>
          <button className="nav-item" onClick={() => navigate('/exchange')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
            Exchange
          </button>
          <button className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Future Credit
          </button>
          <button className="nav-item" onClick={() => navigate('/refund')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Refund
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="back-link" onClick={() => navigate('/dashboard')}>
          &lt; Back to Dashboard
        </div>
        
        <header className="page-header fc-header">
          <div className="header-icon green-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          <div>
            <h1>Future Credit</h1>
            <p>Issue future travel credit for customer</p>
          </div>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Original Ticket Number</label>
                <input type="text" name="originalTicket" placeholder="e.g., TKT-2024-5678" value={formData.originalTicket} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Customer Name</label>
                <input type="text" name="customerName" placeholder="e.g., John Doe" value={formData.customerName} onChange={handleChange} required />
              </div>
              
              <div className="input-group">
                <label>Airline Name</label>
                <input type="text" name="airlineName" placeholder="e.g., Qatar Airways" value={formData.airlineName} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Credit Amount</label>
                <div className="input-with-prefix">
                  <span className="prefix">$</span>
                  <input type="number" name="creditAmount" placeholder="0.00" value={formData.creditAmount} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <label>Issue Date</label>
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
              </div>

              <div className="input-group full-width">
                <label>Customer Email</label>
                <input type="email" name="customerEmail" placeholder="customer@example.com" value={formData.customerEmail} onChange={handleChange} required />
              </div>

              <div className="input-group full-width">
                <label>Notes / Terms & Conditions</label>
                <textarea 
                  name="notes" 
                  rows="4" 
                  placeholder="Enter any additional notes or terms..." 
                  value={formData.notes} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="info-alert">
              <strong>Credit Information:</strong>
              <ul>
                <li>Credit can be used for future bookings with the same airline</li>
                <li>Non-transferable to other passengers</li>
                <li>Must be used before expiry date</li>
                <li>Customer will receive confirmation email</li>
              </ul>
            </div>

            <div className="form-actions-split">
              <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn-success-solid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Issue Credit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default FutureCredit