import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css'; 
import AeroLogo from '../assets/aerologo.jpg';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/');
    }
  };

  const getNavStyle = (path) => {
    const active = location.pathname === path;
    return {
      background: active ? '#3b82f6' : 'transparent', 
      color: active ? '#ffffff' : '#64748b', 
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px', 
      marginLeft: '16px',
      marginRight: '16px',
      width: 'calc(100% - 32px)', 
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: active ? '700' : '600',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
      transition: 'all 0.2s ease',
    };
  };

  return (
    <>
      {/* ⚠️ ABSOLUTE BACKGROUND LAYER OVERRIDE CONFIGURATION */}
      <style>
        {`
          html, body, #root {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100vw !important;
            height: 100vh !important;
            background-color: #f4f7f9 !important; 
            background-image: none !important; /* Cloud background block logic */
            background-size: initial !important;
            background-attachment: initial !important;
            overflow: hidden !important;
          }
          
          /* Main application window sheet structure */
          .crm-layout {
            background-color: #f4f7f9 !important;
            background-image: none !important;
          }

          /* Global scrollbar logic inside main viewer to avoid blank leak gaps */
          main.main-content {
            background-color: #f4f7f9 !important;
            background-image: none !important;
          }
        `}
      </style>

      <div 
        className="crm-layout gemini-system-root"
        style={{ 
          display: 'flex', 
          height: '100vh', 
          width: '100vw', 
          overflow: 'hidden', 
          backgroundColor: '#f4f7f9', 
          margin: 0,
          padding: 0,
        }}
      > 
        {/* WHITE SIDEBAR */}
        <aside 
          style={{ 
            width: '260px', 
            background: '#ffffff', 
            display: 'flex', 
            flexDirection: 'column', 
            paddingTop: '24px',
            borderRight: '1px solid #e2e8f0',
            zIndex: 100,
          }}
        >
          {/* Header & AeroLogo Branding */}
          <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src={AeroLogo} 
              alt="Roamify Logo" 
              style={{ 
                width: '46px',        
                height: '46px',       
                borderRadius: '10px',  
                objectFit: 'cover',   
                border: '1px solid #e2e8f0' 
              }} 
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.5px' }}>
                Roamify
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <button style={getNavStyle('/dashboard')} onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
            <button style={getNavStyle('/new-booking')} onClick={() => navigate('/new-booking')}>🛫 Bookings</button>
            <button style={getNavStyle('/exchange')} onClick={() => navigate('/exchange')}>🔄 Exchange</button>
            <button style={getNavStyle('/future-credit')} onClick={() => navigate('/future-credit')}>💳 Credit</button>
            <button style={getNavStyle('/refund')} onClick={() => navigate('/refund')}>💵 Refund</button>
          </nav>

          {/* Footer / User Profile */}
         {/* Footer / User Profile */}
          <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {/* Dynamically first letter of name dikhayega */}
                {user?.name ? user.name.charAt(0).toUpperCase() : 'JD'}
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>
                  {user?.name || 'John Doe'}
                </h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '12px', textTransform: 'capitalize' }}>
                  {user?.role || 'Admin'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ width: '100%', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.color = '#ef4444'; e.target.style.borderColor = '#fca5a5'; }}
              onMouseOut={(e) => { e.target.style.color = '#64748b'; e.target.style.borderColor = '#e2e8f0'; }}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area (Clean Solid Background with Isolated Scroll) */}
        <main 
          className="main-content" 
          style={{ 
            flex: 1, 
            height: '100vh', 
            overflowY: 'auto',
            backgroundColor: '#f4f7f9',
            margin: 0,
            padding: 0
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;