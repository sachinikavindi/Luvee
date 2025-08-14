import './index.css'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './components/Login.jsx'
import BackendTest from './components/BackendTest.jsx'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'

// Environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated (e.g., check for token in localStorage)
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (token) {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Log backend URL for debugging
  useEffect(() => {
    console.log('🔄 Backend URL:', BACKEND_URL)
  }, [])

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    return children
  }

  // Login page component
  const LoginPage = () => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />
    }
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={() => setIsAuthenticated(false)} />
      <div className='flex w-full'>
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <div className="space-y-6">
                  <div className="text-center py-10">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome to Dashboard</h1>
                    <p className="text-gray-600 mt-2">You are now authenticated and can access all features.</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
                      <p className="text-sm text-blue-800">
                        <strong>Backend URL:</strong> {BACKEND_URL}
                      </p>
                    </div>
                  </div>
                  
                  {/* Temporary Backend Test Component */}
                  <BackendTest />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <Add />
              </ProtectedRoute>
            } />
            <Route path="/list" element={
              <ProtectedRoute>
                <List />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
