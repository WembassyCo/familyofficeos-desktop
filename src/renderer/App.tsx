import React, { useEffect, useState } from 'react'
import { useAuthStore } from './stores/authStore'
import { LoginScreen } from './pages/Login'
import { MainLayout } from './components/layout/MainLayout'
import { LoadingScreen } from './components/common/LoadingScreen'
import './styles/App.css'

export const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false)
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    // Check for existing session on app start
    const init = async () => {
      await checkAuth()
      setInitialized(true)
    }
    init()
  }, [checkAuth])

  if (!initialized || isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <MainLayout />
}