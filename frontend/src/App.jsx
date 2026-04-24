import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AppointmentPage from './pages/AppointmentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Common/Navbar'
import Footer from './components/Common/Footer'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const isAdminRoute = window.location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && (
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
      <main className="flex-1">
        <Routes>
          {/* Booking form loads directly on / — no homepage */}
          <Route path="/" element={<AppointmentPage />} />
          <Route path="/appointment" element={<Navigate to="/" replace />} />
          <Route path="/confirmation/:id" element={<ConfirmationPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App
