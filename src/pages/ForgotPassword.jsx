import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import wingBg from '../assets/wing1.jpg'
import aerologo from '../assets/aerologo.jpg'
import './Register.css'

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
      className="register-page"
      style={{ backgroundImage: `url(${wingBg})` }}
    >
      <div className="register-panel">
        <div className="register-header">
          <div className="register-logo-box">
            <img src={aerologo} alt="Roamify" />
          </div>

          <h1>Forgot Password</h1>
          <p>Reset your password using OTP</p>
        </div>

        <div className="register-form">
          <div className="register-input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <>
              <div className="register-input-group">
                <label>OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="register-input-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {error && (
            <p className="register-error">{error}</p>
          )}

          {message && (
            <p className="register-success">{message}</p>
          )}

          {!otpSent ? (
            <button
              className="register-submit-btn"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          ) : (
            <button
              className="register-submit-btn"
              onClick={resetPassword}
            >
              Reset Password
            </button>
          )}

          <button
            className="register-login-link"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword