import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout' 
import './Dashboard.css' 

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
    refundReason: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ticket_number: formData.ticketNumber,
      airline_name: formData.airlineName,
      pnr_number: formData.pnr,
      refund_amount: formData.refundAmount,
      refund_status: formData.refundStatus,
      refund_method: formData.refundMethod,
      customer_name: formData.customerName,
      refund_reason: formData.refundReason
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refunds/', payload)
      if (response.status === 201) {
        alert("Refund Processed Successfully!")
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Refund Error:", error)
      alert("Error: Refund process nahi ho paya!")
    }
  }

  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    borderRadius: "16px",
    padding: "32px"
  }

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.85)', color: '#1e293b', fontSize: '14px', outline: 'none' }
  const labelStyle = { display: 'block', marginBottom: '8px', color: '#1e293b', fontSize: '14px', fontWeight: 600 }

  return (
    <Layout>
      <div className="dashboard-bg-container">
        <div style={{ marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>&lt; Back to Dashboard</Link>
        </div>
        
        <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#f59e0b', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '32px', color: '#1e293b', margin: 0, fontWeight: 'bold' }}>Process Refund</h1>
            <p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>Issue refund for cancelled booking</p>
          </div>
        </header>

        <div className="form-container" style={glassCardStyle}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div><label style={labelStyle}>Ticket Number</label><input type="text" name="ticketNumber" value={formData.ticketNumber} onChange={handleChange} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Airline Name</label><input type="text" name="airlineName" value={formData.airlineName} onChange={handleChange} required style={inputStyle} /></div>
              <div><label style={labelStyle}>PNR Number</label><input type="text" name="pnr" value={formData.pnr} onChange={handleChange} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Refund Amount</label><input type="number" name="refundAmount" value={formData.refundAmount} onChange={handleChange} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Refund Status</label><select name="refundStatus" value={formData.refundStatus} onChange={handleChange} required style={inputStyle}><option value="">Select status</option><option value="Pending">Pending</option><option value="Completed">Completed</option></select></div>
              <div><label style={labelStyle}>Refund Method</label><select name="refundMethod" value={formData.refundMethod} onChange={handleChange} required style={inputStyle}><option value="">Select method</option><option value="Bank">Bank Transfer</option><option value="Card">Credit Card</option></select></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Customer Name</label><input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required style={inputStyle} /></div>
              <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Refund Reason</label><textarea name="refundReason" rows="3" value={formData.refundReason} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical' }}></textarea></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button type="submit" style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Process Refund</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Refund