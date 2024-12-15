import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { Dashboard } from './components/Dashboard'
import { ToastProvider } from './components/providers/toast-provider'
import './App.scss'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser)
      setIsLoggedIn(true)
      setUserName(`${user.nombre} ${user.apellido}`)
      setUserRole(user.rol)
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = (name: string, role: string, accessToken: string, user: any) => {
    setIsLoggedIn(true)
    setUserName(name)
    setUserRole(role)
    setToken(accessToken)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', accessToken)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
    setUserRole('')
    setToken('')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  if (isLoading) {
    return <div>Loading...</div>
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
          <Route
            path="/dashboard/*"
            element={
              isLoggedIn
                ? <Dashboard
                  userName={userName}
                  userRole={userRole}
                  token={token}
                  onLogout={handleLogout}
                  onNotifications={() => {
                    console.log('Notifications clicked')
                  }}
                />
                : <Navigate to="/login" />
            }
          />
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App

