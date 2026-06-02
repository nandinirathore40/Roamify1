import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import wingBg from '../assets/wing1.jpg'
import API from '../api'

const Login = () => {
  const [role, setRole] = useState('agent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await API.post('login/', {
        email,
        password,
        role,
      })

      login(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email, password, or role')
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
        <div className="login-header">
          <div className="logo-box">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logo-svg"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path>
            </svg>
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#111827',
              margin: '0 0 8px 0',
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: '#374151',
              margin: 0,
              fontWeight: '500',
            }}
          >
            Sign in to Roamify
          </p>
        </div>

        <div className="role-section" style={{ marginBottom: '24px', marginTop: '32px' }}>
          <label className="section-label">Select Role</label>

          <div className="role-toggle-grid" style={{ display: 'flex', gap: '16px' }}>
            <button
              type="button"
              onClick={() => setRole('agent')}
              className={`role-card-btn ${role === 'agent' ? 'active' : ''}`}
            >
              <span>Agent</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('manager')}
              className={`role-card-btn ${role === 'manager' ? 'active' : ''}`}
            >
              <span>Manager</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form-modern">
          <div className="input-group">
            <label>Email Address</label>

            <div className="input-with-icon">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="input-with-icon password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>
          </div>

          <div className="login-actions-row">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login