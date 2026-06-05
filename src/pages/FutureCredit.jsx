import React, { useState } from 'react';
import Layout from '../components/Layout';

const FutureCredit = () => {
  const [creditData, setCreditData] = useState({
    pnrNumber: '',
    passengerName: '',
    originalTicketValue: '',
    cancellationFee: '',
    expiryDate: '',
    remarks: ''
  });

  // Automatically calculate the net credit amount
  const ticketVal = Number(creditData.originalTicketValue) || 0;
  const cancelFee = Number(creditData.cancellationFee) || 0;
  const netCredit = Math.max(0, ticketVal - cancelFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProcessCredit = () => {
    alert(`Processing Future Credit of $${netCredit} for PNR: ${creditData.pnrNumber}`);
    // Yahan backend API call aayegi
  };

  return (
    <Layout>
      <div style={{ padding: '32px 40px', backgroundColor: '#f4f7f9', minHeight: '100%', fontFamily: 'sans-serif' }}>
        
        {/* TOP HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.25)' }}>
            💳
          </div>
          <div>
            <h2 style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>Future Credit</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500' }}>Convert cancelled bookings into travel credits for future use</p>
          </div>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* PASSENGER & BOOKING DETAILS */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '700', margin: '0 0 16px 0' }}>Booking Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>PNR Number</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    name="pnrNumber"
                    placeholder="6-digit PNR"
                    maxLength="6" 
                    value={creditData.pnrNumber}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500',textTransform: 'uppercase' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Passenger Name</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    name="passengerName"
                    placeholder="Enter your name" 
                    value={creditData.passengerName}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* FINANCIAL DETAILS */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '700', margin: '0 0 16px 0' }}>Financial Calculation</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Original Ticket Value</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ paddingLeft: '16px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>$</span>
                  <input 
                    type="number" 
                    name="originalTicketValue"
                    placeholder="0.00" 
                    value={creditData.originalTicketValue}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px 12px 8px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Cancellation Fee</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ paddingLeft: '16px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>$</span>
                  <input 
                    type="number" 
                    name="cancellationFee"
                    placeholder="0.00" 
                    value={creditData.cancellationFee}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px 12px 8px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Credit Expiry Date</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="date" 
                    name="expiryDate"
                    value={creditData.expiryDate}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500', fontFamily: 'sans-serif' }} 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* REMARKS TEXTAREA */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Remarks / Reason</label>
            <div style={{ background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <textarea 
                name="remarks"
                rows="3" 
                placeholder="Enter cancellation reason or specific notes..." 
                value={creditData.remarks}
                onChange={handleInputChange}
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '16px', fontSize: '13px', color: '#334155', fontWeight: '500', resize: 'vertical', fontFamily: 'sans-serif' }}
              />
            </div>
          </div>

          {/* BOTTOM SUMMARY FOOTER BANNER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '24px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
              <span>Ticket Value: <strong style={{ color: '#0f172a' }}>${ticketVal}</strong></span>
              <span>Cancel Fee: <strong style={{ color: '#ef4444' }}>-${cancelFee}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                Net Credit Amount: <span style={{ color: '#10b981', fontSize: '20px', fontWeight: '800', marginLeft: '6px' }}>${netCredit}</span>
              </div>
              <button onClick={handleProcessCredit} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }}>
                Issue Credit
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default FutureCredit;