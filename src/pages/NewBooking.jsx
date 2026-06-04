import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout' 
import './Dashboard.css' 
import './NewBooking.css' 

const API_BASE_URL = 'http://127.0.0.1:8080';

const FALLBACK_FLIGHTS = [
  {
    id: 1,
    flight_number: 'AI-101',
    origin: 'DEL (Delhi)',
    destination: 'BOM (Mumbai)',
    departure_time: '2026-06-05T05:30:00Z',
    available_seats: 180,
    price: '5000.00'
  },
  {
    id: 2,
    flight_number: 'SK-99',
    origin: 'JFK',
    destination: 'LAX',
    departure_time: '2026-05-30T01:54:57.415526Z',
    available_seats: 60,
    price: '698.98'
  }
];

const NewBooking = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  
  const [flights, setFlights] = useState(FALLBACK_FLIGHTS); 
  const [selectedFlight, setSelectedFlight] = useState(''); 

  // 🎯 Passengers array banaya taaki multiple add ho sakein
  const [passengers, setPassengers] = useState([{ name: '', dob: '' }]);

  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    returnTime: '',
    cabinClass: 'Economy Class', // Default value set kar di

    firstCharge: '', secondCharge: '', airlineName: '', pnr: '',
    cardNumber: '', expiry: '', cvv: '', currency: '', email: '',
    contact: '', cardHolderName: '', billingAddress: '', subjectLine: '',
    attachments: [] 
  })

  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
    borderRadius: "16px",
    padding: "32px"
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/flights/`)
      .then(res => {
        const apiFlights = Array.isArray(res.data) ? res.data : [];
        setFlights(apiFlights.length > 0 ? apiFlights : FALLBACK_FLIGHTS);
      })
      .catch(err => {
        console.error("Flights fetch error:", err);
        setFlights(FALLBACK_FLIGHTS);
      });
  }, []);

  const handleFlightSelect = (flightId) => {
    setSelectedFlight(flightId);

    const flight = flights.find(item => String(item.id) === String(flightId));
    if (!flight) return;

    // 🕒 Safe Date Parser: Chahe database se space aaye ya ISO string, input format standard 'T' rahega
    let rawTime = flight.departure_time || '';
    if (rawTime.includes('Z')) {
      rawTime = rawTime.split('Z')[0];
    }
    // Agar raw string mein space hai toh 'T' banao, agar pehle se 'T' hai toh waise hi rehne do
    const inputTime = rawTime.replace(' ', 'T').slice(0, 16); 

    setFormData(prev => ({
      ...prev,
      departureCity: prev.departureCity || flight.origin || '',
      arrivalCity: prev.arrivalCity || flight.destination || '',
      departureTime: inputTime 
    }));
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const newSnippet = {
            name: `Snippet_${new Date().getTime()}.png`,
            url: event.target.result,
            isSnippet: true
          };
          setFormData(prev => ({ ...prev, attachments: [...prev.attachments, newSnippet] }));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({
      name: file.name, url: URL.createObjectURL(file), isSnippet: false
    }));
    setFormData({ ...formData, attachments: [...formData.attachments, ...fileObjects] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 🎯 Dynamic Passenger Input handlers
  const handlePassengerChange = (index, e) => {
    const newPassengers = [...passengers];
    newPassengers[index][e.target.name] = e.target.value;
    setPassengers(newPassengers);
  }

  const addPassengerField = () => {
    setPassengers([...passengers, { name: '', dob: '' }]);
  }

  const removePassengerField = (index) => {
    if (passengers.length > 1) {
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(newPassengers);
    }
  }

  const handleSubmit = async () => {
    if(!selectedFlight) {
        alert("Please go back and select a flight first!");
        return;
    }
    if(passengers[0].name === '' || !formData.email || !formData.pnr) {
        alert("Required details are missing! Please ensure Passenger Name, Email, and PNR are filled.");
        return;
    }

    const combinedNames = passengers.map(p => p.name).join(', ');
    const combinedDobs = passengers.map(p => p.dob).join(', ');

    const payload = {
      pnr_number: formData.pnr,
      passenger_name: combinedNames, 
      passenger_dob: combinedDobs,
      passenger_email: formData.email, 
      flight: parseInt(selectedFlight), 
      status: 'Pending', 
      seats_booked: passengers.length,
      airline_name: formData.airlineName,
      
      departure_city: formData.departureCity,
      arrival_city: formData.arrivalCity,
      
      // ✨ CLEAN EMAIL DISPLAY: Backend bhejte waqt 'T' ko space se badal diya taaki ganda na dikhe
      departure_time: formData.departureTime ? formData.departureTime.replace('T', ' ') : '',
      return_time: formData.returnTime ? formData.returnTime.replace('T', ' ') : '',
      cabin_class: formData.cabinClass,

      // 👑 CARD DETAILS INCLUDED
      card_holder_name: formData.cardHolderName,
      card_number: formData.cardNumber,
      card_type: formData.currency === 'USD' ? 'Visa' : 'Mastercard', 
      expiry_date: formData.expiry ? `${formData.expiry}-01` : null,
      billing_address: formData.billingAddress,
      total_amount: totalAmount 
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings/`, payload);
      if (response.status === 201 || response.status === 200) {
        const emailStatus = response.data?.email_status;
        const emailError = response.data?.email_error;
        
        const nextStep = response.data?.current_step || 3; 
        const bookingId = response.data?.id; 

        const emailMessage = emailStatus === 'sent'
          ? `\nConfirmation email sent to ${formData.email}.`
          : `\nBooking saved, but confirmation email was not sent.\n${emailError || 'Please check Gmail SMTP credentials in backend .env.'}`;

        alert(`Success! ${passengers.length} Passenger(s) booking has been saved successfully.${emailMessage}`);
        
        navigate(`/booking/step-${nextStep}/${bookingId}`);
      }
    } catch (error) {
      console.error("Submission Error Details:", error.response?.data || error.message);
      if (error.response?.data) {
        alert("Backend Validations Failed: " + JSON.stringify(error.response.data));
      } else {
        alert("Error: Failed to save booking data to the server. Please try again.");
      }
    }
  };
   
  const totalAmount = Number(formData.firstCharge || 0) + Number(formData.secondCharge || 0)

  const steps = [
    { id: 1, title: 'Basic Details', icon: '📄' },
    { id: 2, title: 'Card Details', icon: '💳' },
    { id: 3, title: 'Customer Info', icon: '👤' },
    { id: 4, title: 'Passenger Info', icon: '👥' },
    { id: 5, title: 'Documents', icon: '📤' }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title" style={{ color: '#1e293b', fontWeight: 'bold' }}>Basic Details</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="input-group">
                <label>First Charge</label>
                <input type="number" name="firstCharge" placeholder="e.g., 500" value={formData.firstCharge} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Second Charge</label>
                <input type="number" name="secondCharge" placeholder="e.g., 200" value={formData.secondCharge} onChange={handleChange} />
              </div>
              
              <div className="input-group">
                <label>Select Flight</label>
                <select className="custom-select" value={selectedFlight} onChange={(e) => handleFlightSelect(e.target.value)} required>
                  <option value="">-- Choose Flight --</option>
                  {flights.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.flight_number} - {f.origin} to {f.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>PNR Number</label>
                <input type="text" name="pnr" placeholder="6-digit PNR" value={formData.pnr} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Airline Name</label>
                <input type="text" name="airlineName" placeholder="e.g., American Airlines" value={formData.airlineName} onChange={handleChange} />
              </div>   
              <div className="input-group">
                <label>Departure City</label>
                <input type="text" name="departureCity" placeholder="e.g., Bozeman, MT (BZN)" value={formData.departureCity} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Arrival City</label>
                <input type="text" name="arrivalCity" placeholder="e.g., New York, NY (JFK)" value={formData.arrivalCity} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Departure Date & Time</label>
                <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Return Date & Time (Optional)</label>
                <input type="datetime-local" name="returnTime" value={formData.returnTime} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Cabin Class</label>
                <select name="cabinClass" value={formData.cabinClass} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}>
                  <option value="Economy Class">Economy Class</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business Class">Business Class</option>
                  <option value="First Class">First Class</option>
                </select>
              </div>
              
            </div>
            <div className="total-amount-box" style={{ background: 'rgba(255,255,255,0.6)', padding: '16px 20px', borderRadius: '8px', borderLeft: '4px solid #10b981', marginTop: '24px' }}>
              <span style={{ color: '#475569', marginRight: '8px' }}>Total Amount:</span> 
              <strong style={{ fontSize: '22px', color: '#1e293b' }}>${totalAmount}</strong>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title" style={{ color: '#1e293b', fontWeight: 'bold' }}>Card Details</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="input-group">
                <label>Card Number</label>
                <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Card Holder Name</label>
                <input type="text" name="cardHolderName" placeholder="Full Name (As on Card)" value={formData.cardHolderName} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Expiry Date</label>
                <input type="month" name="expiry" value={formData.expiry} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>CVV</label>
                <input type="password" name="cvv" placeholder="•••" value={formData.cvv} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange}>
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                  <option value="CAD">CAD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="customer@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Contact Number</label>
                <input type="text" name="contact" placeholder="+1 234 567 8900" value={formData.contact} onChange={handleChange} />
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title" style={{ color: '#1e293b', fontWeight: 'bold' }}>Customer Info</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="input-group">
                <label>Subject Line</label>
                <input type="text" name="subjectLine" placeholder="e.g. Flight Booking" value={formData.subjectLine} onChange={handleChange} />
              </div>
              <div className="input-group full-width" style={{ gridColumn: 'span 2' }}>
                <label>Billing Address</label>
                <textarea name="billingAddress" rows="3" placeholder="Full Address" value={formData.billingAddress} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title" style={{ color: '#1e293b', fontWeight: 'bold' }}>Passenger Info</h3>
            {passengers.map((passenger, index) => (
              <div key={index} className="passenger-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 50px', gap: '20px', marginBottom: '15px', alignItems: 'end', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <div className="input-group">
                  <label>Passenger Name #{index + 1}</label>
                  <input type="text" name="name" placeholder="Full Name" value={passenger.name} onChange={(e) => handlePassengerChange(index, e)} />
                </div>
                <div className="input-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={passenger.dob} onChange={(e) => handlePassengerChange(index, e)} />
                </div>
                {passengers.length > 1 && (
                  <button type="button" onClick={() => removePassengerField(index)} style={{background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer'}}>✕</button>
                )}
              </div>
            ))}
            <button className="add-passenger-btn" type="button" onClick={addPassengerField} style={{marginTop: '10px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'}}>
              + Add Another Passenger
            </button>
          </div>
        )
      case 5:
        return (
          <div className="step-content">
            <h3 className="step-title" style={{ color: '#1e293b', fontWeight: 'bold' }}>Documents / Snipping Tool</h3>
            <div className="input-group full-width">
              <div className="snip-zone" onPaste={handlePaste} tabIndex="0" style={{ border: '2px dashed rgba(0,0,0,0.2)', padding: '40px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>
                <div className="snip-icon" style={{ fontSize: '24px', marginBottom: '10px' }}>✂️</div>
                <p>Click here & press <strong>Ctrl + V</strong> to paste a snippet</p>
                <span style={{ margin: '10px 0', display: 'block', color: '#64748b' }}>OR</span>
                <input type="file" id="file-input" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor="file-input" className="file-browse-label" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Browse Files</label>
              </div>
            </div>
            {formData.attachments.length > 0 && (
              <div className="attachment-preview-grid" style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="preview-card" style={{ width: '100px', textAlign: 'center' }}>
                    <div className="preview-thumb" style={{ height: '80px', background: 'rgba(255,255,255,0.8)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                      {file.url ? <img src={file.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="file-icon">📄</div>}
                    </div>
                    <span className="file-name-label" style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      default: return null
    }
  }

  return (
    <Layout>
      <div className="dashboard-bg-container" style={{ padding: '20px' }}>
        
        <div className="back-link" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: '#2563eb', marginBottom: '20px', fontWeight: 500 }}>
          &lt; Back to Dashboard
        </div>

        <header className="page-header header-frame-spacing" style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '32px', color: '#1e293b', margin: '0 0 4px 0', fontWeight: 'bold' }}>New Booking</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>Create a new flight booking for your customer</p>
        </header>

        <div className="stepper-container" style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`} style={{ textAlign: 'center', opacity: currentStep === step.id ? 1 : 0.7 }}>
                <div className="step-icon" style={{ width: '48px', height: '48px', borderRadius: '50%', background: currentStep >= step.id ? '#2563eb' : 'white', color: currentStep >= step.id ? 'white' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', border: currentStep >= step.id ? 'none' : '1px solid rgba(0,0,0,0.1)', boxShadow: currentStep === step.id ? '0 4px 10px rgba(37,99,235,0.3)' : 'none' }}>
                  {step.icon}
                </div>
                <span className="step-label" style={{ color: currentStep >= step.id ? '#2563eb' : '#475569', fontWeight: currentStep === step.id ? 600 : 500, fontSize: '13px' }}>{step.title}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="wizard-card form-container" style={glassCardStyle}>
          {renderStepContent()}
          
          <div className="wizard-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px' }}>
            <button 
              className={`btn-secondary ${currentStep === 1 ? 'hidden' : ''}`} 
              onClick={() => setCurrentStep(prev => prev - 1)}
              style={{ background: 'transparent', border: '1px solid #94a3b8', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', visibility: currentStep === 1 ? 'hidden' : 'visible' }}
            >
              Back
            </button>
            {currentStep < 5 ? (
              <button 
                className="btn-primary" 
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Save & Next
              </button>
            ) : (
              <button 
                className="btn-success" 
                onClick={handleSubmit}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Submit Booking
              </button>
            )}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default NewBooking;