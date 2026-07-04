import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import '../pages/Dashboard.css';
import '../pages/NewBooking.css';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://flight-backend-auda.onrender.com';

const FALLBACK_FLIGHTS = [
  { id: 1, flight_number: 'AI-101', origin: 'DEL (Delhi)', destination: 'BOM (Mumbai)', departure_time: '2026-06-05T05:30:00Z', available_seats: 180, price: '5000.00' },
  { id: 2, flight_number: 'SK-99', origin: 'JFK', destination: 'LAX', departure_time: '2026-05-30T01:54:57.415526Z', available_seats: 60, price: '698.98' }
];

const EditBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(1);
  const [flights, setFlights] = useState(FALLBACK_FLIGHTS);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [passengers, setPassengers] = useState([{ name: '', dob: '' }]);
  const [loading, setLoading] = useState(true);
  const [customAlert, setCustomAlert] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    returnTime: '',
    cabinClass: 'Economy Class',
    firstCharge: '',
    secondCharge: '',
    airlineName: '',
    pnr: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    currency: '',
    email: '',
    contact: '',
    cardHolderName: '',
    billingAddress: '',
    subjectLine: '',
    attachments: []
  });

  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.45)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
    borderRadius: "16px",
    padding: "32px"
  };

  // Fetch flights list
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/flights/`)
      .then(res => {
        const apiFlights = Array.isArray(res.data) ? res.data : [];
        setFlights(apiFlights.length > 0 ? apiFlights : FALLBACK_FLIGHTS);
      })
      .catch(() => setFlights(FALLBACK_FLIGHTS));
  }, []);

  // Fetch existing booking and pre-fill form
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/${id}/`);
        const b = res.data;
        setBookingId(b.id);

        // Passengers - naam aur dob split karke fill karo
        const names = b.passenger_name ? b.passenger_name.split(', ') : [''];
        const dobs = b.passenger_dob ? b.passenger_dob.split(', ') : [''];
        const passengersData = names.map((name, i) => ({
          name: name || '',
          dob: dobs[i] || ''
        }));
        setPassengers(passengersData);

        // Flight set karo
        if (b.flight) setSelectedFlight(String(b.flight));

        // Departure time format fix
        let depTime = b.departure_time || '';
        if (depTime.includes(' ')) depTime = depTime.replace(' ', 'T');
        depTime = depTime.slice(0, 16);

        let retTime = b.return_time || '';
        if (retTime.includes(' ')) retTime = retTime.replace(' ', 'T');
        retTime = retTime.slice(0, 16);

        // Total amount se firstCharge/secondCharge nikaalo (approximation)
        const total = parseFloat(b.total_amount || 0);

        setFormData({
          departureCity: b.departure_city || '',
          arrivalCity: b.arrival_city || '',
          departureTime: depTime,
          returnTime: retTime,
          cabinClass: b.cabin_class || 'Economy Class',
          firstCharge: total > 0 ? String(total) : '',
          secondCharge: '',
          airlineName: b.airline_name || '',
          pnr: b.pnr_number || '',
          cardNumber: user?.role === 'manager' ? (b.card_number_last4 || '') : '',
          expiry: b.expiry_date || '',
          cvv: '',               // CVV kabhi store nahi hota — kisi ko bhi nahi dikhega
          currency: '',
          email: b.passenger_email || '',
          contact: '',
          cardHolderName: b.card_holder_name || '',
          billingAddress: b.billing_address || '',
          subjectLine: '',
          attachments: []
        });

        setLoading(false);
      } catch (err) {
        console.error('Booking fetch error:', err);
        setLoading(false);
        Swal.fire({ title: 'Error', text: 'Could not load booking details.', icon: 'error' });
      }
    };

    if (id) fetchBooking();
  }, [id]);

  const handleFlightSelect = (flightId) => {
    setSelectedFlight(flightId);
    const flight = flights.find(item => String(item.id) === String(flightId));
    if (!flight) return;

    let rawTime = flight.departure_time || '';
    if (rawTime.includes('Z')) rawTime = rawTime.split('Z')[0];
    const inputTime = rawTime.replace(' ', 'T').slice(0, 16);

    setFormData(prev => ({
      ...prev,
      departureCity: prev.departureCity || flight.origin || '',
      arrivalCity: prev.arrivalCity || flight.destination || '',
      departureTime: inputTime
    }));
  };

  const validateStep = () => {
    if (activeStep === 1) {
      if (!selectedFlight || String(selectedFlight).trim() === '') return "Please select a flight.";
      if (!formData.pnr || formData.pnr.trim() === '') return "PNR Number is required.";
      if (formData.pnr.trim().length !== 6) return "PNR Number must be exactly 6 characters.";
      if (!formData.departureCity || !formData.arrivalCity) return "Departure and Arrival cities are required.";
      if (!formData.departureTime) return "Departure Date & Time is required.";
    }
    if (activeStep === 2) {
      if (!formData.cardHolderName || formData.cardHolderName.trim() === '') return "Card Holder Name is required.";
      if (!formData.email || formData.email.trim() === '') return "Email Address is required.";
    }
    if (activeStep === 3) {
      if (!formData.billingAddress || formData.billingAddress.trim() === '') return "Billing Address is required.";
    }
    if (activeStep === 4) {
      for (let i = 0; i < passengers.length; i++) {
        if (!passengers[i].name || passengers[i].name.trim() === '') return `Passenger #${i + 1} Name cannot be empty.`;
        if (!passengers[i].dob || passengers[i].dob.trim() === '') return `Passenger #${i + 1} Date of Birth is required.`;
      }
    }
    return null;
  };

  const showAlert = (title, message, type = 'success', onClose = null) => {
    setCustomAlert({ title, message, type, onClose });
  };

  const handleNext = (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { showAlert("Validation Error", err, "error"); return; }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (activeStep > 1) setActiveStep(prev => prev - 1);
    else navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePassengerChange = (index, e) => {
    const newPassengers = [...passengers];
    newPassengers[index][e.target.name] = e.target.value;
    setPassengers(newPassengers);
  };

  const addPassengerField = () => setPassengers([...passengers, { name: '', dob: '' }]);

  const removePassengerField = (index) => {
    if (passengers.length > 1) setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const newSnippet = { name: `Snippet_${Date.now()}.png`, url: event.target.result, isSnippet: true };
          setFormData(prev => ({ ...prev, attachments: [...prev.attachments, newSnippet] }));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({ name: file.name, url: URL.createObjectURL(file), isSnippet: false }));
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...fileObjects] }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const err = validateStep();
    if (err) { showAlert("Validation Error", err, "error"); return; }

    const combinedNames = passengers.map(p => p.name).join(', ');
    const combinedDobs = passengers.map(p => p.dob).join(', ');
    const totalAmount = Number(formData.firstCharge || 0) + Number(formData.secondCharge || 0);

    const payload = {
      pnr_number: formData.pnr,
      passenger_name: combinedNames,
      passenger_dob: combinedDobs,
      passenger_email: formData.email,
      flight: parseInt(selectedFlight),
      airline_name: formData.airlineName,
      departure_city: formData.departureCity,
      arrival_city: formData.arrivalCity,
      departure_time: formData.departureTime ? formData.departureTime.replace('T', ' ') : '',
      return_time: formData.returnTime ? formData.returnTime.replace('T', ' ') : '',
      cabin_class: formData.cabinClass,
      card_holder_name: formData.cardHolderName,
      expiry_date: formData.expiry,
      billing_address: formData.billingAddress,
      total_amount: String(totalAmount),
      seats_booked: passengers.length,
    };

    // Card number/CVV sirf tab update karo jab fill kiya ho
    if (formData.cardNumber && formData.cardNumber.trim() !== '') {
      payload.card_number = formData.cardNumber;
    }

    try {
      await axios.patch(`${API_BASE_URL}/api/bookings/${id}/`, payload);
      showAlert(
        "Booking Updated!",
        "Booking details have been updated successfully.",
        "success",
        () => navigate('/dashboard')
      );
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      showAlert("Error", "Failed to update booking. Please try again.", "error");
    }
  };

  const totalAmount = Number(formData.firstCharge || 0) + Number(formData.secondCharge || 0);

  const steps = [
    { id: 1, label: 'Basic Details', icon: '📄' },
    { id: 2, label: 'Card Details', icon: '💳' },
    { id: 3, label: 'Customer Info', icon: '👤' },
    { id: 4, label: 'Passenger', icon: '👥' },
    { id: 5, label: 'Documents', icon: '📎' },
  ];

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontSize: '16px', color: '#64748b' }}>
          Loading booking details...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f4f7f9', fontFamily: 'sans-serif' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '40px' }}>
          <div
            onClick={handleBack}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}
          >
            {'<'} {activeStep > 1 ? `Back to Step ${activeStep - 1}` : 'Back to Dashboard'}
          </div>
          <h2 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '800', margin: '0 0 4px 0' }}>
            {user?.role === 'manager' ? 'Booking Details (Manager View)' : 'Edit Booking'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0, fontWeight: '500' }}>
            {user?.role === 'manager'
              ? 'Full booking details — all fields visible and editable'
              : 'Update booking details — all fields are editable'}
          </p>
        </div>

        {/* STEPPER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', left: '5%', right: '5%', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
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
                  {isCompleted ? '✓' : step.icon}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: isActive ? '#3b82f6' : isCompleted ? '#0f172a' : '#64748b', textAlign: 'center' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* FORM CARD */}
        <div style={glassCardStyle}>

          {/* STEP 1: BASIC DETAILS */}
          {activeStep === 1 && (
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '24px' }}>Basic Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>First Charge</label>
                  <input type="number" name="firstCharge" placeholder="e.g., 500" value={formData.firstCharge} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Second Charge</label>
                  <input type="number" name="secondCharge" placeholder="e.g., 200" value={formData.secondCharge} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Select Flight *</label>
                  <select value={selectedFlight} onChange={(e) => handleFlightSelect(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', boxSizing: 'border-box' }}>
                    <option value="">-- Choose Flight --</option>
                    {flights.map(f => (
                      <option key={f.id} value={f.id}>{f.flight_number} - {f.origin} to {f.destination}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>PNR Number *</label>
                  <input
                    type="text" name="pnr" placeholder="6-char PNR" maxLength={6}
                    value={formData.pnr}
                    onChange={(e) => setFormData(prev => ({ ...prev, pnr: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Airline Name</label>
                  <input type="text" name="airlineName" placeholder="American Airlines" value={formData.airlineName} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Departure City *</label>
                  <input type="text" name="departureCity" placeholder="Bozeman, MT (BZN)" value={formData.departureCity} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Arrival City *</label>
                  <input type="text" name="arrivalCity" placeholder="New York, NY (JFK)" value={formData.arrivalCity} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Departure Date & Time *</label>
                  <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Return Date & Time (Optional)</label>
                  <input type="datetime-local" name="returnTime" value={formData.returnTime} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Cabin Class</label>
                  <select name="cabinClass" value={formData.cabinClass} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', boxSizing: 'border-box' }}>
                    <option value="Economy Class">Economy Class</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business Class">Business Class</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '16px 20px', borderRadius: '8px', borderLeft: '4px solid #10b981', marginTop: '24px' }}>
                <span style={{ color: '#475569', marginRight: '8px' }}>Total Amount:</span>
                <strong style={{ fontSize: '22px', color: '#1e293b' }}>${totalAmount}</strong>
              </div>
            </div>
          )}

          {/* STEP 2: CARD DETAILS */}
          {activeStep === 2 && (
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '8px' }}>Card Details</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>
                {user?.role === 'manager'
                  ? '💡 Showing last 4 digits of card on file. CVV is never stored for security.'
                  : '💡 Card Number aur CVV blank chhod sakte ho agar change nahi karna'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                    Card Number {user?.role === 'manager' && <span style={{ color: '#94a3b8', fontWeight: '400' }}>(last 4 digits on file)</span>}
                  </label>
                  <input type="text" name="cardNumber" placeholder={user?.role === 'manager' ? 'Enter new full card number to update' : 'Leave blank to keep existing'} value={formData.cardNumber} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Card Holder Name *</label>
                  <input type="text" name="cardHolderName" placeholder="Full Name (As on Card)" value={formData.cardHolderName} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Expiry Date</label>
                  <input type="month" name="expiry" value={formData.expiry} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>CVV</label>
                  <input type="password" name="cvv" placeholder="Leave blank to keep existing" value={formData.cvv} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', boxSizing: 'border-box' }}>
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                    <option value="CAD">CAD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Email Address *</label>
                  <input type="email" name="email" placeholder="customer@example.com" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Contact Number</label>
                  <input type="text" name="contact" placeholder="+1 234 567 8900" value={formData.contact} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER INFO */}
          {activeStep === 3 && (
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '24px' }}>Customer Info</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Subject Line</label>
                  <input type="text" name="subjectLine" placeholder="Flight Booking" value={formData.subjectLine} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Billing Address *</label>
                  <textarea name="billingAddress" rows="3" placeholder="Full Address" value={formData.billingAddress} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PASSENGER */}
          {activeStep === 4 && (
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '24px' }}>Passenger Info</h3>
              {passengers.map((passenger, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 50px', gap: '20px', marginBottom: '15px', alignItems: 'end', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Passenger Name #{index + 1} *</label>
                    <input type="text" name="name" placeholder="Full Name" value={passenger.name} onChange={(e) => handlePassengerChange(index, e)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Date of Birth *</label>
                    <input type="date" name="dob" value={passenger.dob} onChange={(e) => handlePassengerChange(index, e)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
                  </div>
                  {passengers.length > 1 && (
                    <button type="button" onClick={() => removePassengerField(index)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPassengerField} style={{ marginTop: '10px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                + Add Another Passenger
              </button>
            </div>
          )}

          {/* STEP 5: DOCUMENTS */}
          {activeStep === 5 && (
            <div>
              <h3 style={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '24px' }}>Documents / Snipping Tool</h3>
              <div
                onPaste={handlePaste}
                tabIndex="0"
                style={{ border: '2px dashed rgba(0,0,0,0.2)', padding: '40px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
              >
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>✂️</div>
                <p>Click here & press <strong>Ctrl + V</strong> to paste a snippet</p>
                <span style={{ margin: '10px 0', display: 'block', color: '#64748b' }}>OR</span>
                <input type="file" id="file-input" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor="file-input" style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Browse Files</label>
              </div>
              {formData.attachments.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {formData.attachments.map((file, index) => (
                    <div key={index} style={{ width: '100px', textAlign: 'center' }}>
                      <div style={{ height: '80px', background: 'rgba(255,255,255,0.8)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                        {file.url ? <img src={file.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div>📄</div>}
                      </div>
                      <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px' }}>
            <button
              type="button"
              onClick={handleBack}
              style={{ background: 'transparent', border: '1px solid #94a3b8', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', visibility: activeStep === 1 ? 'hidden' : 'visible' }}
            >
              Back
            </button>
            {activeStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Save & Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 32px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Update Booking
              </button>
            )}
          </div>

        </div>
      </div>

      {/* CUSTOM ALERT */}
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
            <div style={{ padding: '20px', color: '#475569', fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {customAlert.message}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px 20px' }}>
              <button
                className="confirm-booking-btn"
                onClick={() => {
                  const closeAction = customAlert.onClose;
                  setCustomAlert(null);
                  if (closeAction) closeAction();
                }}
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

export default EditBooking;
