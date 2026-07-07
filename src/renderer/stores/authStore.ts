import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  hasStoredCredentials: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  unlockWithBiometrics: () => Promise<void>
  checkStoredCredentials: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasStoredCredentials: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Mock login for now
          await new Promise(resolve => setTimeout(resolve, 500))
          set({
            user: {
              id: '1',
              email,
              name: 'Test User',
              role: 'admin'
            },
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ error: 'Login failed', isLoading: false })
        }
      },

      logout: async () => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 200))
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      checkAuth: async () => {
        // Mock auth check
        await new Promise(resolve => setTimeout(resolve, 100))
        // For demo, auto-login
        set({
          user: {
            id: '1',
            email: 'demo@wembassy.com',
            name: 'Demo User',
            role: 'admin'
          },
          isAuthenticated: true,
          isLoading: false
        })
      },

      clearError: () => set({ error: null }),

      unlockWithBiometrics: async () => {
        set({ isLoading: true })
        try {
          // Mock biometric unlock
          await new Promise(resolve => setTimeout(resolve, 300))
          set({
            user: {
              id: '1',
              email: 'demo@wembassy.com',
              name: 'Demo User',
              role: 'admin'
            },
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ error: 'Biometric authentication failed', isLoading: false })
        }
      },

      checkStoredCredentials: async () => {
        // Mock check for stored credentials
        await new Promise(resolve => setTimeout(resolve, 50))
        set({ hasStoredCredentials: false })
      }
    }),
    { name: 'auth-store' }
  )
)
