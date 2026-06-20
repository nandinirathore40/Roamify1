import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import wingBg from '../assets/wing1.jpg'
import AeroLogo from '../assets/aerologo.jpg'

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

    try {const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://flight-backend-auda.onrender.com'}/api/login/`, {
      
        email,
        password,
        role,
      })

      login(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
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
        {/* HEADER */}
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
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Welcome Back</h1>
          <p style={{ fontSize: '15px', color: '#374151', margin: 0, fontWeight: '500' }}>Sign in to Roamify</p>
        </div>

        {/* ROLE SECTION */}
        <div className="role-section" style={{ marginBottom: '24px', marginTop: '16px' }}>
          <label className="section-label" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Select Role
          </label>
          
          <div className="role-toggle-grid" style={{ display: 'flex', gap: '16px' }}>
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
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}/>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Password</label>
            <div className="input-with-icon password-wrap" style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', paddingRight: '40px' }}/>
              <button type="button" className="pwd-toggle-btn" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>👁</button>
            </div>
          </div>

          <div className="login-actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', marginBottom: '24px' }}>
            <label className="remember-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <button
    type="button"
    className="forgot-link"
    onClick={() => navigate('/forgot-password')}
    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
  >
    Forgot password?
  </button>

  <button
    type="button"
    onClick={() => navigate('/register')}
    className="forgot-link"
    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
  >
    Register
  </button>
</div>
          </div>

          {error && <p className="error-text" style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading} style={{ width: '100%', padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login