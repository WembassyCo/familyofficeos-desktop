import React, { useEffect } from 'react'
import { LoginScreen } from './pages/Login'
import { TenantSelect } from './pages/TenantSelect'
import { MainApp } from './pages/MainApp'
import { useAuthStore } from './stores/authStore'
import { useAppStore } from './stores/appStore'
import './styles/App.css'

export const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { selectedTenant, showTenantSelect } = useAppStore()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading FamilyOfficeOS...</p>
      </div>
    )
  }

  // Auth flow: Login → Tenant Select → Main App
  if (!isAuthenticated) {
    return <LoginScreen />
  }

  if (showTenantSelect || !selectedTenant) {
    return <TenantSelect />
  }

  return <MainApp />
}
