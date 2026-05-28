import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import wingBg from '../assets/wing1.jpg'

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
      const mockUser = {
        name: role === 'manager' ? 'Admin Manager' : 'Agent User',
        email,
        role,
        token: 'mock-token-123',
      }
      login(mockUser)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
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
        overflow: 'hidden'
      }}
    >
      {/* LEFT LOGIN CARD */}
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
          zIndex: 10
        }}
      >
        {/* HEADER */}
        <div className="login-header">
          <div className="logo-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 3.1-2.9 2.9-3.6-.6-.9.9 2.9 4 4 2.9.9-.9-.6-3.6 2.9-2.9 3.1 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Welcome Back</h1>
          <p style={{ fontSize: '15px', color: '#374151', margin: 0, fontWeight: '500' }}>Sign in to SkyBook CRM</p>
        </div>

        {/* ROLE SECTION */}
        <div className="role-section" style={{ marginBottom: '24px', marginTop: '32px' }}>
          <label className="section-label" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Select Role
          </label>
          
          <div className="role-toggle-grid" style={{ display: 'flex', gap: '16px' }}>
            {/* AGENT BUTTON */}
            <button 
              type="button" 
              onClick={() => setRole('agent')}
              style={{
                flex: 1,
                background: role === 'agent' ? 'rgba(26, 115, 232, 0.15)' : 'rgba(255, 255, 255, 0.7)',
                border: `1px solid ${role === 'agent' ? '#1a73e8' : '#d1d5db'}`,
                borderRadius: '12px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                color: role === 'agent' ? '#1a73e8' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px', marginBottom: '8px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Agent</span>
            </button>

            {/* MANAGER BUTTON */}
            <button 
              type="button" 
              onClick={() => setRole('manager')}
              style={{
                flex: 1,
                background: role === 'manager' ? 'rgba(26, 115, 232, 0.15)' : 'rgba(255, 255, 255, 0.7)',
                border: `1px solid ${role === 'manager' ? '#1a73e8' : '#d1d5db'}`,
                borderRadius: '12px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                color: role === 'manager' ? '#1a73e8' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px', marginBottom: '8px' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Manager</span>
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form-modern">
          <div className="input-group">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Email Address</label>
            <div className="input-with-icon">
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Password</label>
            <div className="input-with-icon password-wrap">
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="pwd-toggle-btn" onClick={() => setShowPassword(!showPassword)}>👁</button>
            </div>
          </div>

          <div className="login-actions-row">
            <label className="remember-checkbox">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
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
      
      {/* TEXT HATA DIYA GAYA HAI */}
    </div>
  )
}

export default Login