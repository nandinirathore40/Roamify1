import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import wingBg from '../assets/wing1.jpg'
import aerologo from '../assets/aerologo.jpg'
import './Login.css' 

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOtp = async () => {
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email')
      return
    }

    setLoading(true)

    try {
      await API.post('send-password-reset-otp/', {
        email,
      })

      setOtpSent(true)
      setMessage('OTP sent to your registered email')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setError('')
    setMessage('')

    try {
      await API.post('reset-password-with-otp/', {
        email,
        otp,
        new_password: newPassword,
      })

      setMessage('Password reset successful')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed')
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
        {/* MATCHING HEADER */}
        <div className="login-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src={aerologo} 
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
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Forgot Password</h1>
          <p style={{ fontSize: '15px', color: '#374151', margin: 0, fontWeight: '500' }}>Reset your password using OTP</p>
        </div>

        {/* FORM */}
        <div className="login-form-modern">
          <div className="input-group">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Email Address</label>
            <div className="input-with-icon">
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
              />
            </div>
          </div>

          {otpSent && (
            <>
              <div className="input-group" style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Enter OTP</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>New Password</label>
                <div className="input-with-icon">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }}
                  />
                </div>
              </div>
            </>
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
              onClick={resetPassword}
              style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' }}
            >
              Reset Password
            </button>
          )}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#1a73e8', fontWeight: '700' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword