import React, { useState, useEffect } from 'react' // 1. useEffect yahan add kiya
import { useNavigate } from 'react-router-dom'
import './NewBooking.css'
import axios from 'axios';

const NewBooking = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  
  // 2. States hamesha function ke andar honi chahiye
  const [flights, setFlights] = useState([]); 
  const [selectedFlight, setSelectedFlight] = useState(''); 

  const [formData, setFormData] = useState({
    firstCharge: '',
    secondCharge: '',
    airlineName: '', // Dropdown use karenge par state rakhte hain safe side
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
    passengerName: '',
    dob: '',
    attachments: [] 
  })

  // 3. API se flights fetch karna
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/flights/')
      .then(res => setFlights(res.data))
      .catch(err => console.error("Flights fetch error:", err));
  }, []);

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
          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, newSnippet]
          }));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      isSnippet: false
    }));
    setFormData({ ...formData, attachments: [...formData.attachments, ...fileObjects] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 4. Submit logic with selected flight
  const handleSubmit = async () => {
    if(!selectedFlight) {
        alert("Pehle flight select karo!");
        return;
    }

    const payload = {
      passenger_name: formData.passengerName,
      flight: selectedFlight, // Asali ID dropdown se
      status: 'Confirmed'
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bookings/', payload);
      if (response.status === 201) {
        alert("Success! Booking database mein save ho gayi hai.");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert("Error: Backend se connection nahi ho paya!");
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
            <h3 className="step-title">Basic Details</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>First Charge</label>
                <input type="number" name="firstCharge" placeholder="e.g., 500" value={formData.firstCharge} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Second Charge</label>
                <input type="number" name="secondCharge" placeholder="e.g., 200" value={formData.secondCharge} onChange={handleChange} />
              </div>
              
              {/* 5. AIRLINE INPUT KI JAGAH DROPDOWN */}
              <div className="input-group">
                <label>Select Flight</label>
                <select 
                  className="custom-select"
                  value={selectedFlight} 
                  onChange={(e) => setSelectedFlight(e.target.value)}
                  required
                >
                  <option value="">-- Choose Flight --</option>
                  {flights.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.flight_number} ({f.origin} to {f.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>PNR Number</label>
                <input type="text" name="pnr" placeholder="6-digit PNR" value={formData.pnr} onChange={handleChange} />
              </div>
            </div>
            <div className="total-amount-box">
              Total Amount: <strong>${totalAmount}</strong>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">Card Details</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Card Number</label>
                <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} />
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
            <h3 className="step-title">Customer Info</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Card Holder Name</label>
                <input type="text" name="cardHolderName" placeholder="Full Name" value={formData.cardHolderName} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Subject Line</label>
                <input type="text" name="subjectLine" placeholder="e.g. Flight Booking" value={formData.subjectLine} onChange={handleChange} />
              </div>
              <div className="input-group full-width">
                <label>Billing Address</label>
                <textarea name="billingAddress" rows="3" placeholder="Full Address" value={formData.billingAddress} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title">Passenger Info</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Passenger Name</label>
                <input type="text" name="passengerName" placeholder="Full Name" value={formData.passengerName} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
            </div>
            <button className="add-passenger-btn" type="button" style={{marginTop: '15px'}}>+ Add Another Passenger</button>
          </div>
        )
      case 5:
        return (
          <div className="step-content">
            <h3 className="step-title">Documents / Snipping Tool</h3>
            <div className="input-group full-width">
              <div className="snip-zone" onPaste={handlePaste} tabIndex="0">
                <div className="snip-icon">✂️</div>
                <p>Click here & press <strong>Ctrl + V</strong> to paste a snippet</p>
                <span>OR</span>
                <input type="file" id="file-input" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor="file-input" className="file-browse-label">Browse Files</label>
              </div>
            </div>
            {formData.attachments.length > 0 && (
              <div className="attachment-preview-grid">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="preview-card">
                    <div className="preview-thumb">
                      {file.url ? <img src={file.url} alt="preview" /> : <div className="file-icon">📄</div>}
                    </div>
                    <span className="file-name-label">{file.name}</span>
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
    <div className="crm-layout">
      {/* Sidebar and rest of your JSX remains same */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-blue">✈</div>
          <div className="logo-text">
            <h2>SkyBook CRM</h2>
            <p>Travel Management</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
          <button className="nav-item active">🛫 New Booking</button>
          <button className="nav-item" onClick={() => navigate('/exchange')}>🔄 Exchange</button>
          <button className="nav-item" onClick={() => navigate('/future-credit')}>💳 Future Credit</button>
          <button className="nav-item" onClick={() => navigate('/refund')}>💵 Refund</button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="back-link" onClick={() => navigate('/dashboard')}>&lt; Back to Dashboard</div>
        <header className="page-header">
          <h1>New Booking</h1>
          <p>Create a new flight booking for your customer</p>
        </header>

        <div className="stepper-container">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                <div className="step-icon">{step.icon}</div>
                <span className="step-label">{step.title}</span>
              </div>
              {index < steps.length - 1 && <div className={`step-line ${currentStep > step.id ? 'completed' : ''}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="wizard-card">
          {renderStepContent()}
          <div className="wizard-footer">
            <button className={`btn-secondary ${currentStep === 1 ? 'hidden' : ''}`} onClick={() => setCurrentStep(prev => prev - 1)}>Back</button>
            {currentStep < 5 ? (
              <button className="btn-primary" onClick={() => setCurrentStep(prev => prev + 1)}>Next Step</button>
            ) : (
              <button className="btn-success" onClick={handleSubmit}>Submit Booking</button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default NewBooking;