import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout' 
import './Dashboard.css'

const Refund = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    ticketNumber: '',
    airlineName: '',
    pnrNumber: '',
    refundAmount: '',
    refundStatus: '',
    refundMethod: '',
    customerName: '',
    refundReason: ''
  })

  const inputsRef = useRef([])

  // CSS overrides ko direct smash karke layout apply karne ke liye
  useEffect(() => {
    inputsRef.current.forEach((input) => {
      if (input) {
        input.style.setProperty('background-color', '#f1f5f9', 'important'); // Exact clean soft gray container block fill
        input.style.setProperty('border', 'none', 'important'); // Borders flat cleanup
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ticket_number: formData.ticketNumber,
      airline_name: formData.airlineName,
      pnr_number: formData.pnrNumber,
      refund_amount: formData.refundAmount || 0.00,
      refund_status: formData.refundStatus,
      refund_method: formData.refundMethod,
      customer_name: formData.customerName,
      refund_reason: formData.refundReason
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refunds/', payload)
      if (response.status === 201) {
        alert("Success! Refund request database mein save ho gayi.")
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Refund Submission Error:", error.response?.data || error.message)
      alert("Error: Backend tak request nahi pahonchi!")
    }
  }

  // --- WHITE BASE CONTAINER WITH VISIBLE GREY BLOCKS ---
  const formCardStyle = {
    background: '#ffffff', // Clean white paper design base
    borderRadius: '16px',
    padding: '40px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f1f5f9', // Light gray standard highlight box
    outline: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px'
  }

  const focusEffect = (e) => {
    e.target.style.setProperty('background-color', '#e2e8f0', 'important'); // Deepen grid block on active focus
    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
  }
  
  const blurEffect = (e) => {
    e.target.style.setProperty('background-color', '#f1f5f9', 'important'); // Fallback to classic light gray block shape
    e.target.style.boxShadow = 'none';
  }

  return (
    <Layout>
      <div style={{ padding: '32px 40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Header Title Branding */}
        <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#3b82f6', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 4px 0', fontWeight: '800' }}>Process Refund</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px', fontWeight: '500' }}>Issue refund for cancelled booking</p>
          </div>
        </header>

        {/* Pure White Container Sheet */}
        <div className="form-container" style={formCardStyle}>
          <form onSubmit={handleSubmit}>
            
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Ticket Number</label>
                <input ref={el => inputsRef.current[0] = el} type="text" name="ticketNumber" value={formData.ticketNumber} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} placeholder="Enter ticket number" />
              </div>
              <div>
                <label style={labelStyle}>Airline Name</label>
                <input ref={el => inputsRef.current[1] = el} type="text" name="airlineName" value={formData.airlineName} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} placeholder="Enter airline name" />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>PNR Number</label>
                <input ref={el => inputsRef.current[2] = el} type="text" name="pnrNumber" value={formData.pnrNumber} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} placeholder="Enter 6-digit PNR" />
              </div>
              <div>
                <label style={labelStyle}>Refund Amount</label>
                <input ref={el => inputsRef.current[3] = el} type="text" name="refundAmount" value={formData.refundAmount} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} placeholder="$ 0.00" />
              </div>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Refund Status</label>
                <select ref={el => inputsRef.current[4] = el} name="refundStatus" value={formData.refundStatus} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect}>
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Refund Method</label>
                <select ref={el => inputsRef.current[5] = el} name="refundMethod" value={formData.refundMethod} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect}>
                  <option value="">Select method</option>
                  <option value="Original Payment Method">Original Payment Method</option>
                  <option value="Wallet / Credit">Wallet / Credit</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Customer Name</label>
              <input ref={el => inputsRef.current[6] = el} type="text" name="customerName" value={formData.customerName} onChange={handleChange} required style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} placeholder="Enter customer name" />
            </div>

            {/* Row 5 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Refund Reason</label>
              <textarea ref={el => inputsRef.current[7] = el} name="refundReason" rows="4" value={formData.refundReason} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusEffect} onBlur={blurEffect} placeholder="Enter description for refund reason..."></textarea>
            </div>

            {/* Submit Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
              <button 
                type="submit" 
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                Process Credit
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  )
}

export default Refund