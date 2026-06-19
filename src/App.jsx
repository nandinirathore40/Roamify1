import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewBooking from './pages/NewBooking'
import Exchange from './pages/Exchange'
import FutureCredit from './pages/FutureCredit'
import Refund from './pages/Refund'
import AdminAccess from './pages/AdminAccess'
import Register from './pages/Register'
import FlightList from './components/FlightList';
import ForgotPassword from './pages/ForgotPassword'
// Agar user logged in nahi hai, toh seedha root ("/") par wapas bhej do jahan Login page hai
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      {/* 1. Root Path - Agar user hai toh Dashboard, nahi toh Login page */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/flights" element={<ProtectedRoute><FlightList /></ProtectedRoute>} />
      {/* 2. Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/new-booking" element={<ProtectedRoute><NewBooking /></ProtectedRoute>} />
      <Route path="/exchange" element={<ProtectedRoute><Exchange /></ProtectedRoute>} />
      <Route path="/future-credit" element={<ProtectedRoute><FutureCredit /></ProtectedRoute>} />
      <Route path="/refund" element={<ProtectedRoute><Refund /></ProtectedRoute>} />
      <Route path="/admin-access" element={<ProtectedRoute><AdminAccess /></ProtectedRoute>} />
      {/* 3. Fallback - Koi galat URL daale toh seedha root par bhej do */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
  path="/register"
  element={user ? <Navigate to="/dashboard" replace /> : <Register />}
  
/>
<Route path="/forgot-password" element={<ForgotPassword />} />
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