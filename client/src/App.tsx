import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { Dashboard } from './components/Dashboard'
import { ToastProvider } from './components/providers/toast-provider'
import { Button } from "@/components/ui/button"
import './App.scss'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <ToastProvider>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <div className="app-container">
          <main className="main-content">
            {isLogin ? (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm />
            )}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </Button>
            </div>
          </main>
        </div>
      )}
    </ToastProvider>
  )
}

export default App

