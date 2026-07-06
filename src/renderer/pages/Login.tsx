import React, { useState, useEffect } from 'react'
import { Lock, User, Eye, EyeOff, Fingerprint } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import '../styles/Login.css'

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  
  const { login, unlockWithBiometrics, isLoading, error, clearError, hasStoredCredentials } = useAuthStore()

  useEffect(() => {
    // Check if we have stored credentials for biometric unlock
    const checkStoredCredentials = async () => {
      const hasCreds = await window.electronAPI.secureStorage.get('credentials')
      if (hasCreds) {
        setShowBiometric(true)
      }
    }
    checkStoredCredentials()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login(username, password)
  }

  const handleBiometricUnlock = async () => {
    await unlockWithBiometrics()
  }

  return (
    <div className="fox-login-container">
      <div className="fox-login-box">
        <div className="fox-login-header">
          <div className="fox-login-logo">
            <span>🦊</span>
          </div>
          <h1>FamilyOfficeOS</h1>
          <p>Sign in to your family office</p>
        </div>

        {showBiometric && (
          <button
            className="fox-btn fox-btn-secondary fox-biometric-btn"
            onClick={handleBiometricUnlock}
            disabled={isLoading}
          >
            <Fingerprint size={20} />
            Unlock with Biometrics
          </button>
        )}

        <form className="fox-login-form" onSubmit={handleSubmit}>
          <div className="fox-form-group">
            <label htmlFor="username">Username</label>
            <div className="fox-input-wrapper">
              <User size={16} className="fox-input-icon" />
              <input
                id="username"
                type="text"
                className="fox-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div className="fox-form-group">
            <label htmlFor="password">Password</label>
            <div className="fox-input-wrapper">
              <Lock size={16} className="fox-input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="fox-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="fox-input-action"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="fox-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="fox-btn fox-btn-primary fox-login-submit"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (
              <>
                <span className="fox-loading-spinner-sm" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="fox-login-footer">
          <p>Protected by enterprise-grade security</p>
          <p>© 2026 Wembassy LLC</p>
        </div>
      </div>
    </div>
  )
}