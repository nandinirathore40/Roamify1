import React, { useState } from 'react';
import Layout from '../components/Layout';
import './NewBooking.css'; // File ko blank rakhna!

const NewBooking = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    firstCharge: '',
    secondCharge: '',
    selectFlight: '',
    pnrNumber: '',
    // Step 2: Card Details
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    // Step 3: Customer Info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    // Step 4: Passenger Details
    passengerName: '',
    passengerAge: '',
    passengerGender: '',
    seatPreference: '',
    // Step 5: Documents
    passportNumber: '',
    visaStatus: '',
  });
  const steps = [
    { id: 1, label: 'Basic Details', icon: '📄' },
    { id: 2, label: 'Card Details', icon: '💳' },
    { id: 3, label: 'Customer Info', icon: '👤' },
    { id: 4, label: 'Passenger', icon: '👥' },
    { id: 5, label: 'Documents', icon: '📎' },
  ];

  // Live Total Amount Calculation Fix
  const totalAmount = (parseFloat(formData.firstCharge) || 0) + (parseFloat(formData.secondCharge) || 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step Validation Logic Before Moving Next
  const validateStep = () => {
    if (activeStep === 1) {
      if (!formData.firstCharge || !formData.secondCharge || !formData.selectFlight || !formData.pnrNumber) {
        alert('Please fill all Basic Details before proceeding.');
        return false;
      }
    }
    if (activeStep === 2) {
      if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvv) {
        alert('Please fill all Card Details before proceeding.');
        return false;
      }
    }
    if (activeStep === 3) {
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.customerAddress) {
        alert('Please fill all Customer Information fields.');
        return false;
      }
    }
    if (activeStep === 4) {
      if (!formData.passengerName || !formData.passengerAge || !formData.passengerGender || !formData.seatPreference) {
        alert('Please fill all Passenger details.');
        return false;
      }
    }
    if (activeStep === 5) {
      if (!formData.passportNumber || !formData.visaStatus) {
        alert('Please complete the Documents section.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return; // Validation check fail toh aage nahi badhega

    if (activeStep < 5) {
      setActiveStep((prev) => prev + 1);
    } else {
      alert('Booking Submitted Successfully!');
      console.log('Final Data:', formData);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    } else {
      alert('Navigating back to dashboard...');
    }
  };

  // Styles System
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    outline: 'none',
    fontSize: '14px',
    color: '#0f172a',
    boxSizing: 'border-box',
    transition: 'border 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px'
  };

  const focusEffect = (e) => e.target.style.borderColor = '#3b82f6';
  const blurEffect = (e) => e.target.style.borderColor = '#e2e8f0';

  return (
    <Layout>
      <div style={{ padding: '32px 40px', backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: '40px' }}>
          <div 
            onClick={handleBack} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
          >
            <span>{'<'}</span> {activeStep > 1 ? `Back to Step ${activeStep - 1}` : 'Back to Dashboard'}
          </div>
          <h2 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0' }}>New Booking</h2>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0, fontWeight: '500' }}>Create a new flight booking for your customer</p>
        </div>

        {/* STEPPER (PROGRESS BAR) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
          {/* Background Line */}
          <div style={{ position: 'absolute', top: '24px', left: '5%', right: '5%', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
          
          {/* Active Colored Progress Line */}
          <div style={{ position: 'absolute', top: '24px', left: '5%', width: `${((activeStep - 1) / 4) * 90}%`, height: '2px', background: '#3b82f6', zIndex: 0, transition: 'width 0.3s ease' }}></div>

          {steps.map((step) => {
            const isActive = step.id === activeStep;
            const isCompleted = step.id < activeStep;
            
            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '100px' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', 
                  background: isActive || isCompleted ? '#3b82f6' : '#fff', 
                  color: isActive || isCompleted ? '#fff' : '#94a3b8',
                  border: isActive || isCompleted ? 'none' : '2px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '20px', fontWeight: 'bold', marginBottom: '12px',
                  boxShadow: isActive ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {step.icon}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: isActive ? '#3b82f6' : isCompleted ? '#0f172a' : '#64748b', textAlign: 'center' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* FORM CONTAINER */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>
            {steps[activeStep - 1].label}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            
            {/* STEP 1: BASIC DETAILS */}
            {activeStep === 1 && (
              <>
                <div>
                  <label style={labelStyle}>First Charge</label>
                  <input type="number" name="firstCharge" value={formData.firstCharge} onChange={handleInputChange} placeholder="e.g., 500" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Second Charge</label>
                  <input type="number" name="secondCharge" value={formData.secondCharge} onChange={handleInputChange} placeholder="e.g., 200" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Select Flight</label>
                  <select name="selectFlight" value={formData.selectFlight} onChange={handleInputChange} style={inputStyle} onFocus={focusEffect} onBlur={blurEffect}>
                    <option value="">-- Choose Flight --</option>
                    <option value="DEL - BOM (6E-204)">DEL - BOM (6E-204)</option>
                    <option value="BLR - DEL (AI-501)">BLR - DEL (AI-501)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>PNR Number</label>
                  <input type="text" name="pnrNumber" value={formData.pnrNumber} onChange={handleInputChange} placeholder="6-digit PNR" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
              </>
            )}

            {/* STEP 2: CARD DETAILS */}
            {activeStep === 2 && (
              <>
                <div>
                  <label style={labelStyle}>Card Number</label>
                  <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="xxxx xxxx xxxx xxxx" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Card Holder Name</label>
                  <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder="John Doe" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/YY" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input type="password" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} placeholder="***" maxLength="3" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
              </>
            )}

            {/* STEP 3: CUSTOMER INFO */}
            {activeStep === 3 && (
              <>
                <div>
                  <label style={labelStyle}>Customer Name</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="Full Name" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} placeholder="example@mail.com" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} placeholder="+1 234 567 890" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Billing Address</label>
                  <input type="text" name="customerAddress" value={formData.customerAddress} onChange={handleInputChange} placeholder="Street, City, Country" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
              </>
            )}

            {/* STEP 4: PASSENGER INFO */}
            {activeStep === 4 && (
              <>
                <div>
                  <label style={labelStyle}>Passenger Name</label>
                  <input type="text" name="passengerName" value={formData.passengerName} onChange={handleInputChange} placeholder="As on Passport" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" name="passengerAge" value={formData.passengerAge} onChange={handleInputChange} placeholder="Years" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select name="passengerGender" value={formData.passengerGender} onChange={handleInputChange} style={inputStyle} onFocus={focusEffect} onBlur={blurEffect}>
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Seat Preference</label>
                  <select name="seatPreference" value={formData.seatPreference} onChange={handleInputChange} style={inputStyle} onFocus={focusEffect} onBlur={blurEffect}>
                    <option value="">-- No Preference --</option>
                    <option value="Window">Window</option>
                    <option value="Aisle">Aisle</option>
                    <option value="Extra Legroom">Extra Legroom</option>
                  </select>
                </div>
              </>
            )}

            {/* STEP 5: DOCUMENTS */}
            {activeStep === 5 && (
              <>
                <div>
                  <label style={labelStyle}>Passport Number</label>
                  <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} placeholder="AXXXXXXX" style={inputStyle} onFocus={focusEffect} onBlur={blurEffect} />
                </div>
                <div>
                  <label style={labelStyle}>Visa Status</label>
                  <select name="visaStatus" value={formData.visaStatus} onChange={handleInputChange} style={inputStyle} onFocus={focusEffect} onBlur={blurEffect}>
                    <option value="">-- Select Status --</option>
                    <option value="Not Required">Visa Not Required</option>
                    <option value="Valid Visa Attached">Valid Visa Attached</option>
                    <option value="Visa on Arrival">Visa on Arrival</option>
                  </select>
                </div>
              </>
            )}

          </div>

          {/* TOTAL & ACTION BUTTONS WITH BACK OPTION */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '16px', color: '#64748b', fontWeight: '600' }}>
              Total Amount: <span style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800', marginLeft: '8px' }}>${totalAmount}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* BACK BUTTON: Step 2 ya usse aage active hone par dikhega */}
              {activeStep > 1 && (
                <button 
                  type="button"
                  onClick={handleBack}
                  style={{ background: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.background = '#fff'}
                >
                  Back
                </button>
              )}
              
              <button 
                type="button"
                onClick={handleNext}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
              >
                {activeStep === 5 ? 'Submit Booking' : 'Next Step'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default NewBooking;