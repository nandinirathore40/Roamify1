import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import './Exchange.css';
import './Dashboard.css';

const Exchange = () => {
  const [exchangeData, setExchangeData] = useState({
    oldTicketNumber: '',
    airlineName: '',
    pnrNumber: '',
    exchangeFee: '',
    newDepartureCity: '',
    newArrivalCity: '',
    newDepartureDate: '',
    newReturnDate: '',
    newTicketFare: 0,
    airlinePenalty: 0,
    agentServiceFee: 0,
    exchangeReason: ''
  });

  // FIXED: multiCitySegments ka schema intermediate logic ke sath align kiya hai
  const [flightType, setFlightType] = useState('one-way');
  const [multiCitySegments, setMultiCitySegments] = useState([
    { intermediateCity: '', depDate: '' }
  ]);

  const originalFare = 0; 
  const fareDiff = Math.max(0, exchangeData.newTicketFare - originalFare);
  const totalToCollect = Number(fareDiff) + Number(exchangeData.airlinePenalty) + Number(exchangeData.agentServiceFee) + Number(exchangeData.exchangeFee || 0);

  const navigate = useNavigate();
  const [customAlert, setCustomAlert] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExchangeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FIXED: Handler for linear intermediate flight paths
  const handleSegmentChange = (index, field, value) => {
    const newSegments = [...multiCitySegments];
    newSegments[index][field] = value;
    setMultiCitySegments(newSegments);
  };

  const addSegment = () => {
    setMultiCitySegments([...multiCitySegments, { intermediateCity: '', depDate: '' }]);
  };

  const removeSegment = (index) => {
    const newSegments = multiCitySegments.filter((_, i) => i !== index);
    setMultiCitySegments(newSegments);
  };

  const handleSubmit = async () => {
    // STRICT VALIDATION
    if (!exchangeData.pnrNumber || exchangeData.pnrNumber.trim().length !== 6) {
      setCustomAlert({ title: "Validation Error", message: "PNR Number must be exactly 6 characters.", type: "error" });
      return;
    }
    if (!exchangeData.newDepartureCity || exchangeData.newDepartureCity.trim() === '') {
      setCustomAlert({ title: "Validation Error", message: "Departure City 1 (Origin) is required.", type: "error" });
      return;
    }
    if (flightType === 'multi-city') {
      for (let i = 0; i < multiCitySegments.length; i++) {
        if (!multiCitySegments[i].intermediateCity || !multiCitySegments[i].depDate) {
          setCustomAlert({ title: "Validation Error", message: `Please fill all details for Intermediate Route Block #${i + 1}.`, type: "error" });
          return;
        }
      }
      if (!exchangeData.newArrivalCity || exchangeData.newArrivalCity.trim() === '') {
        setCustomAlert({ title: "Validation Error", message: "Final Arrival City is required.", type: "error" });
        return;
      }
    }

    const payload = {
      old_ticket_number: exchangeData.oldTicketNumber,
      airline_name: exchangeData.airlineName,
      pnr_number: exchangeData.pnrNumber,
      exchange_fee: exchangeData.exchangeFee || 0,
      
      trip_type: flightType,
      new_departure_city: exchangeData.newDepartureCity.trim(),
      new_arrival_city: exchangeData.newArrivalCity.trim(),
      new_departure_date: flightType !== 'multi-city' && exchangeData.newDepartureDate ? exchangeData.newDepartureDate : null,
      new_return_date: flightType === 'two-way' && exchangeData.newReturnDate ? exchangeData.newReturnDate : null,
      multi_city_route: flightType === 'multi-city' ? JSON.stringify(multiCitySegments) : '',

      new_ticket_fare: exchangeData.newTicketFare || 0,
      airline_penalty: exchangeData.airlinePenalty || 0,
      agent_service_fee: exchangeData.agentServiceFee || 0,
      exchange_reason: exchangeData.exchangeReason,
      total_to_collect: totalToCollect
    };

    try {
      const response = await axios.post('https://flight-backend-auda.onrender.com/api/exchanges/', payload);
      if (response.status === 201 || response.status === 200) {
        setCustomAlert({
          title: "Exchange Processed Successfully",
          message: "Exchange request has been saved to the database.",
          type: "success",
          onClose: () => navigate('/dashboard')
        });
      }
    } catch (error) {
      console.error("Exchange Submission Error:", error.response?.data || error.message);
      const backendError = error.response?.data?.message || error.response?.data?.error || "Could not save exchange request to the server.";
      setCustomAlert({
        title: "Submission Failed",
        message: `Error: ${backendError}`,
        type: "error"
      });
    }
  };

  return (
    <Layout>
      <div style={{ padding: '32px 40px', backgroundColor: '#f4f7f9', minHeight: '100%', fontFamily: 'sans-serif' }}>
        
        {/* TOP HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.25)' }}>
            🔄
          </div>
          <div>
            <h2 style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>Exchange Ticket</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500' }}>Process ticket exchange for existing booking</p>
          </div>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* TOP 4 FIELDS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Old Ticket Number</label>
              <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  name="oldTicketNumber"
                  placeholder="e.g., TKT-2024-1234" 
                  value={exchangeData.oldTicketNumber}
                  onChange={handleInputChange}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Airline Name</label>
              <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  name="airlineName"
                  placeholder="e.g., Emirates" 
                  value={exchangeData.airlineName}
                  onChange={handleInputChange}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>PNR Number</label>
              <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  name="pnrNumber"
                  placeholder="6-digit PNR" 
                  maxLength="6"
                  value={exchangeData.pnrNumber}
                  onChange={(e) => {
                    const formattedPnr = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    setExchangeData(prev => ({ ...prev, pnrNumber: formattedPnr }));
                  }}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500', textTransform: 'uppercase' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Exchange Fee</label>
              <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                <span style={{ paddingLeft: '16px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>₹</span>
                <input 
                  type="number" 
                  name="exchangeFee"
                  placeholder="0.00" 
                  value={exchangeData.exchangeFee}
                  onChange={handleInputChange}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px 12px 8px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC NEW FLIGHT DETAILS */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '700', margin: '0 0 16px 0' }}>New Flight Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>Trip Type</label>
                <select 
                  value={flightType} 
                  onChange={(e) => setFlightType(e.target.value)} 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #3b82f6', background: '#eff6ff', color: '#1e3a8a', fontWeight: '700', outline: 'none' }}
                >
                  <option value="one-way">One-Way</option>
                  <option value="two-way">Round Trip (Two-Way)</option>
                  <option value="multi-city">Multi-City</option>
                </select>
              </div>

              {/* FIXED: Primary Origin block is always mapped first */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>New Departure City 1 (Origin) *</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    name="newDepartureCity"
                    placeholder="Enter City" 
                    value={exchangeData.newDepartureCity}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>

              {flightType !== 'multi-city' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>New Arrival City</label>
                    <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        name="newArrivalCity"
                        placeholder="Enter City" 
                        value={exchangeData.newArrivalCity}
                        onChange={handleInputChange}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>New Departure Date</label>
                    <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="date" 
                        name="newDepartureDate"
                        value={exchangeData.newDepartureDate}
                        onChange={handleInputChange}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500', fontFamily: 'sans-serif' }} 
                      />
                    </div>
                  </div>
                </>
              )}

              {flightType === 'two-way' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>New Return Date</label>
                  <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="date" 
                      name="newReturnDate"
                      value={exchangeData.newReturnDate}
                      onChange={handleInputChange}
                      style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500', fontFamily: 'sans-serif' }} 
                    />
                  </div>
                </div>
              )}

              {/* FIXED: Structural layout sequence for Multi-City Exchange */}
              {flightType === 'multi-city' && (
                <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '16px', color: '#0f172a', fontSize: '14px', fontWeight: 'bold' }}>Multi-City Route Details</h4>
                  
                  {multiCitySegments.map((segment, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '700' }}>Intermediate City {index + 1} *</label>
                        <input type="text" placeholder="e.g. LAX" value={segment.intermediateCity} onChange={(e) => handleSegmentChange(index, 'intermediateCity', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: '700' }}>Dep. Date *</label>
                        <input type="date" value={segment.depDate} onChange={(e) => handleSegmentChange(index, 'depDate', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'sans-serif' }} />
                      </div>
                      {multiCitySegments.length > 1 && (
                        <button type="button" onClick={() => removeSegment(index)} style={{ padding: '10px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                      )}
                    </div>
                  ))}
                  
                  <button type="button" onClick={addSegment} style={{ marginTop: '10px', marginBottom: '20px', padding: '10px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'block' }}>
                    + Add Next Flight
                  </button>

                  {/* FINAL BLOCK RENDERING */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>New Final Arrival City *</label>
                    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #cbd5e1', width: '50%', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        name="newArrivalCity"
                        placeholder="Final Destination e.g. DXB" 
                        value={exchangeData.newArrivalCity}
                        onChange={handleInputChange}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FARE SUMMARIES & PENALTIES */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#0f172a', fontWeight: '700', margin: '0 0 16px 0' }}>Exchange Fare & Penalties</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>New Ticket Fare</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                  <span style={{ paddingLeft: '16px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>₹</span>
                  <input 
                    type="number" 
                    name="newTicketFare"
                    placeholder="Enter value" 
                    value={exchangeData.newTicketFare || ''}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px 12px 8px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Airline Penalty Fee</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                  <span style={{ paddingLeft: '16px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>₹</span>
                  <input 
                    type="number" 
                    name="airlinePenalty"
                    placeholder="Enter value" 
                    value={exchangeData.airlinePenalty || ''}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px 12px 8px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Agent Service Fee</label>
                <div style={{ background: '#f1f5f9', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'text', display: 'flex', alignItems: 'center' }}>
                  <span style={{ paddingLeft: '16px', color: '#64748b', fontSize: '13px', fontWeight: '700' }}>₹</span>
                  <input 
                    type="number" 
                    name="agentServiceFee"
                    placeholder="Enter value" 
                    value={exchangeData.agentServiceFee || ''}
                    onChange={handleInputChange}
                    style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '12px 16px 12px 8px', fontSize: '13px', color: '#334155', fontWeight: '500' }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Exchange Reason</label>
              <div style={{ background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'text' }}>
                <textarea 
                  name="exchangeReason"
                  rows="4" 
                  placeholder="Enter reason for flight exchange..." 
                  value={exchangeData.exchangeReason}
                  onChange={handleInputChange}
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: '16px', fontSize: '13px', color: '#334155', fontWeight: '500', resize: 'vertical', fontFamily: 'sans-serif' }}
                />
              </div>
            </div>

            {/* BANNER FOOTER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '24px', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                <span>Original Fare: <strong style={{ color: '#0f172a' }}>₹{originalFare}</strong></span>
                <span>Fare Diff: <strong style={{ color: '#0f172a' }}>₹{fareDiff}</strong></span>
                <span>Penalty: <strong style={{ color: '#0f172a' }}>₹{exchangeData.airlinePenalty || 0}</strong></span>
                <span>Agent Fee: <strong style={{ color: '#0f172a' }}>₹{exchangeData.agentServiceFee || 0}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                  Total to Collect: <span style={{ color: '#22c55e', fontSize: '20px', fontWeight: '800', marginLeft: '6px' }}>₹{totalToCollect}</span>
                </div>
                <button 
                  onClick={handleSubmit}
                  style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }}
                >
                  Process Exchange
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {customAlert && (
        <div className="details-modal-overlay">
          <div className="details-modal">
            <div className="details-modal-header">
              <div>
                <h3>{customAlert.title}</h3>
                <p>{customAlert.type === 'success' ? 'Operation Completed' : 'Attention Required'}</p>
              </div>
              <button className="details-close-btn" onClick={() => setCustomAlert(null)}>✕</button>
            </div>
            <div style={{ padding: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
              {customAlert.message}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="confirm-booking-btn"
                onClick={() => {
                  const closeAction = customAlert.onClose;
                  setCustomAlert(null);
                  if (closeAction) closeAction();
                }}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Exchange;