import { ipcMain } from 'electron'
import { SecureStorage } from './secureStorage'

interface Credentials {
  username: string
  password: string
}

export class AuthService {
  constructor(private secureStorage: SecureStorage) {}

  async login(credentials: Credentials): Promise<{ success: boolean; token?: string }> {
    console.log('Login attempt:', credentials.username)
    return { success: true, token: 'mock-token-12345' }
  }

  async logout(): Promise<{ success: boolean }> {
    console.log('Logout')
    return { success: true }
  }

  async checkSession(): Promise<{ authenticated: boolean; user?: any }> {
    return { authenticated: true, user: { id: '1', name: 'Demo User' } }
  }

  async unlockWithBiometrics(): Promise<{ success: boolean }> {
    console.log('Biometric unlock attempt')
    return { success: true }
  }
}
