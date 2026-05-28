import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewBooking from './pages/NewBooking'
import Exchange from './pages/Exchange'
import FutureCredit from './pages/FutureCredit'
import Refund from './pages/Refund'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      {/* 1. Landing Page (Home) sabke liye open hai */}
      <Route path="/" element={<Home />} />
      
      {/* 2. Login Page sirf tab dikhega agar user logged in nahi hai */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      
      {/* 3. Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/new-booking" element={<ProtectedRoute><NewBooking /></ProtectedRoute>} />
      <Route path="/exchange" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
      <Route path="/future-credit" element={<ProtectedRoute><FutureCredit /></ProtectedRoute>} />
      <Route path="/refund" element={<ProtectedRoute><Refund /></ProtectedRoute>} />
      
      {/* 4. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App