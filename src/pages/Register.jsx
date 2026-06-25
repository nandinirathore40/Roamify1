import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import './Login.css' 
import wingBg from '../assets/wing1.jpg'
import AeroLogo from '../assets/aerologo.jpg'

const Register = () => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const sendOtp = async () => {
    setError('')
    setMessage('')

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await API.post('send-registration-otp/', {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      setOtpSent(true)
      setMessage('OTP sent to your email.')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setError('')
    setMessage('')

    if (!otp) {
      setError('Please enter OTP.')
      return
    }

    setLoading(true)

    try {
      await API.post('verify-registration-otp/', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      })

      setMessage('Registration successful. Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${wingBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
          margin: 0,
          borderRadius: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '10px 0 30px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}
      >
        <div className="login-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src={AeroLogo} 
            alt="Roamify Logo" 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '12px', 
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              marginBottom: '16px'
            }} 
          />
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Create Account</h1>
          <p style={{ fontSize: '15px', color: '#374151', margin: 0, fontWeight: '500' }}>Register as an Agent</p>
        </div>

        <div className="login-form-modern">
          <div className="input-group">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Full Name</label>
            <div className="input-with-icon">
              <input 
                type="text" 
                placeholder="Enter full name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                disabled={otpSent}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Email Address</label>
            <div className="input-with-icon">
              <input 
                type="email" 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={otpSent}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  disabled={otpSent}
                  style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
                />
                <button 
  type="button" 
  onClick={() => setShowPassword(!showPassword)} 
  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
  {showPassword ? (
    /* Jab password Dikh raha ho -> Cut wali aankh (Hide karne ka option) */
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  ) : (
    /* Jab password Hidden ho -> Normal aankh (Show karne ka option) */
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  )}
</button>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Confirm</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  disabled={otpSent}
                  style={{ width: '100%', padding: '12px', paddingRight: '40px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
                />
                <button 
  type="button" 
  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
  {showConfirmPassword ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  )}
</button>
              </div>
            </div>
          </div>

          {otpSent && (
            <div className="input-group" style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Enter OTP</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  maxLength="6"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
                />
              </div>
            </div>
          )}

          {error && <p className="error-text" style={{ color: '#ef4444', fontSize: '13px', margin: '8px 0 0 0', fontWeight: '600', textAlign: 'center' }}>{error}</p>}
          {message && <p style={{ color: '#166534', fontSize: '13px', margin: '8px 0 0 0', fontWeight: '600', textAlign: 'center' }}>{message}</p>}

          {!otpSent ? (
            <button 
              type="button" 
              className="submit-btn" 
              onClick={sendOtp} 
              disabled={loading} 
              style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          ) : (
            <button 
              type="button" 
              className="submit-btn" 
              onClick={verifyOtp} 
              disabled={loading} 
              style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}
            >
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              className="forgot-link"
              onClick={() => navigate('/login')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#1a73e8', fontWeight: '700' }}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register