import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import './Register.css'
import wingBg from '../assets/wing1.jpg'
import aerologo from '../assets/aerologo.jpg'

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
      className="register-page"
      style={{ backgroundImage: `url(${wingBg})` }}
    >
      <div className="register-panel">
        <div className="register-header">
          <div className="register-logo-box">
            <img src={aerologo} alt="Roamify" />
          </div>

          <h1>Create Agent Account</h1>
          <p>Register with email OTP verification</p>
        </div>

        <div className="register-role-box">
          Role: <strong>Agent</strong>
        </div>

        <div className="register-form">
          <div className="register-input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={otpSent}
            />
          </div>

          <div className="register-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
            />
          </div>

          <div className="register-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={otpSent}
            />
          </div>

          <div className="register-input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div className="register-input-group">
              <label>Enter OTP</label>
              <input
  type="text"
  placeholder="6-digit OTP"
  value={otp}
  maxLength="6"
  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
/>
            </div>
          )}

          {error && <p className="register-error">{error}</p>}
          {message && <p className="register-success">{message}</p>}

          {!otpSent ? (
            <button className="register-submit-btn" onClick={sendOtp} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          ) : (
            <button className="register-submit-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
          )}

          <button
            className="register-login-link"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register