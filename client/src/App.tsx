import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { Dashboard } from './components/Dashboard'
import { ToastProvider } from './components/providers/toast-provider'
import './App.scss'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <div className="app-container">
                <main className="main-content">
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                </main>
              </div>
            )
          } />
          <Route path="/register" element={
            <div className="app-container">
              <main className="main-content">
                <RegisterForm />
              </main>
            </div>
          } />
          <Route path="/dashboard/*" element={
            isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App

