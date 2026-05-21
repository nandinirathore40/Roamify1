import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // AXIOS IMPORT KIYA
import './Refund.css'

const Refund = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    ticketNumber: '',
    airlineName: '',
    pnr: '',
    refundAmount: '',
    refundStatus: '',
    refundMethod: '',
    customerName: '',
    refundReason: '',
    internalNotes: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // UPDATED HANDLESUBMIT WITH AXIOS POST
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Django ke model ke variable names ke mutabiq payload banaya
    const payload = {
      ticket_number: formData.ticketNumber,
      airline_name: formData.airlineName,
      pnr_number: formData.pnr,
      refund_amount: formData.refundAmount,
      refund_status: formData.refundStatus,
      refund_method: formData.refundMethod,
      customer_name: formData.customerName,
      refund_reason: formData.refundReason,
      internal_notes: formData.internalNotes || "" // Optional field handling
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refunds/', payload)
      if (response.status === 201) {
        alert("Refund Request Submitted Successfully and Saved to Database!")
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Refund Submission Error:", error.response?.data || error.message)
      alert("Error: Backend tak refund request nahi pahonchi!")
    }
  }

  return (
    <div className="crm-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.5 19.5 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" opacity="0"></path><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path><line x1="8" y1="21" x2="16" y2="21"></line></svg>
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
          <button className="nav-item" onClick={() => navigate('/future-credit')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Future Credit
          </button>
          <button className="nav-item active">
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
        
        <header className="page-header refund-header">
          <div className="header-icon orange-bg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
          </div>
          <div>
            <h1>Process Refund</h1>
            <p>Issue refund for cancelled booking</p>
          </div>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Ticket Number</label>
                <input type="text" name="ticketNumber" placeholder="e.g., TKT-2024-9012" value={formData.ticketNumber} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Airline Name</label>
                <input type="text" name="airlineName" placeholder="e.g., British Airways" value={formData.airlineName} onChange={handleChange} required />
              </div>
              
              <div className="input-group">
                <label>PNR Number</label>
                <input type="text" name="pnr" placeholder="6-digit PNR" value={formData.pnr} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Refund Amount</label>
                <div className="input-with-prefix">
                  <span className="prefix">$</span>
                  <input type="number" name="refundAmount" placeholder="0.00" value={formData.refundAmount} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <label>Refund Status</label>
                <select name="refundStatus" value={formData.refundStatus} onChange={handleChange} required>
                  <option value="">Select status</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
              <div className="input-group">
                <label>Refund Method</label>
                <select name="refundMethod" value={formData.refundMethod} onChange={handleChange} required>
                  <option value="">Select method</option>
                  <option value="credit_card">Original Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="wallet">Wallet Balance</option>
                </select>
              </div>

              <div className="input-group full-width">
                <label>Customer Name</label>
                <input type="text" name="customerName" placeholder="e.g., Emma Wilson" value={formData.customerName} onChange={handleChange} required />
              </div>

              <div className="input-group full-width">
                <label>Refund Reason</label>
                <textarea 
                  name="refundReason" 
                  rows="3" 
                  placeholder="Enter detailed reason for refund..." 
                  value={formData.refundReason} 
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="input-group full-width">
                <label>Internal Notes (Optional)</label>
                <textarea 
                  name="internalNotes" 
                  rows="2" 
                  placeholder="Add internal notes for record keeping..." 
                  value={formData.internalNotes} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="policy-alert">
              <strong>Refund Policy:</strong>
              <ul>
                <li>Refunds typically processed within 5-7 business days</li>
                <li>Cancellation fees may apply based on airline policy</li>
                <li>Non-refundable tickets may only qualify for future credit</li>
                <li>Customer will receive email confirmation upon completion</li>
              </ul>
            </div>

            <div className="form-actions-split">
              <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn-warning-solid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Process Refund
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  )
}

export default Refund