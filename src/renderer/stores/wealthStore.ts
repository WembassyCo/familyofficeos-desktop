import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getDirectoryApi } from '../services/api'

export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'loan' | 'property' | 'other'
  institution: string
  accountNumber?: string
  balance: number
  currency: string
  lastUpdated: string
  isActive: boolean
  plaidAccountId?: string
  plaidItemId?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  accountId: string
  accountName?: string
  date: string
  description: string
  amount: number
  currency: string
  type: 'debit' | 'credit'
  category?: string
  subcategory?: string
  merchant?: string
  notes?: string
  isPending: boolean
  plaidTransactionId?: string
  createdAt: string
}

export interface Holding {
  id: string
  accountId: string
  symbol: string
  name: string
  assetType: 'stock' | 'bond' | 'fund' | 'etf' | 'crypto' | 'commodity' | 'cash' | 'other'
  quantity: number
  costBasis?: number
  currentPrice: number
  currentValue: number
  currency: string
  lastUpdated: string
}

export interface Portfolio {
  totalValue: number
  totalCostBasis?: number
  unrealizedGainLoss?: number
  currency: string
  lastUpdated: string
  allocation: AllocationItem[]
  performance: PerformanceData
}

export interface AllocationItem {
  category: string
  value: number
  percentage: number
}

export interface PerformanceData {
  daily: number
  weekly: number
  monthly: number
  yearly: number
  allTime: number
}

export interface PlaidLink {
  linkToken: string
  expiration: string
}

interface WealthState {
  accounts: Account[]
  transactions: Transaction[]
  holdings: Holding[]
  portfolio: Portfolio | null
  selectedAccount: Account | null
  isLoading: boolean
  error: string | null
  plaidLinkToken: string | null
  
  // Date range filters
  dateRange: { start?: string; end?: string } | null
  
  // Actions
  fetchAccounts: () => Promise<void>
  fetchTransactions: (accountId?: string, params?: { startDate?: string; endDate?: string }) => Promise<void>
  fetchHoldings: (accountId?: string) => Promise<void>
  fetchPortfolio: () => Promise<void>
  
  createAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  refreshAccount: (id: string) => Promise<void>
  
  createPlaidLink: () => Promise<void>
  exchangePlaidToken: (publicToken: string) => Promise<void>
  syncPlaidAccounts: () => Promise<void>
  
  selectAccount: (account: Account | null) => void
  setDateRange: (range: { start?: string; end?: string } | null) => void
  clearFilters: () => void
  
  // Analytics
  getTotalBalance: () => number
  getAccountTypeBreakdown: () => Record<string, number>
  getMonthlyCashFlow: () => { income: number; expenses: number }
}

export const useWealthStore = create<WealthState>()(
  devtools(
    (set, get) => ({
      accounts: [],
      transactions: [],
      holdings: [],
      portfolio: null,
      selectedAccount: null,
      isLoading: false,
      error: null,
      plaidLinkToken: null,
      dateRange: null,

      fetchAccounts: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const accounts = await api.getAccounts()
          set({ accounts, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchTransactions: async (accountId, params) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const transactions = accountId
            ? await api.getTransactions(accountId, params)
            : []
          set({ transactions, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchHoldings: async (accountId) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const holdings = accountId
            ? await api.getHoldings(accountId)
            : []
          set({ holdings, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchPortfolio: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const portfolio = await api.getPortfolio()
          set({ portfolio, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createAccount: async (account) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newAccount = await api.createAccount(account)
          set((state) => ({
            accounts: [newAccount, ...state.accounts],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateAccount: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateAccount(id, updates)
          set((state) => ({
            accounts: state.accounts.map((a) => (a.id === id ? updated : a)),
            selectedAccount: state.selectedAccount?.id === id ? updated : state.selectedAccount
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteAccount: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteAccount(id)
          set((state) => ({
            accounts: state.accounts.filter((a) => a.id !== id),
            selectedAccount: state.selectedAccount?.id === id ? null : state.selectedAccount
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      refreshAccount: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.refreshAccount(id)
          await get().fetchAccounts()
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      createPlaidLink: async () => {
        try {
          const api = getDirectoryApi()
          const response = await api.createPlaidLink()
          set({ plaidLinkToken: response.link_token })
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      exchangePlaidToken: async (publicToken) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          await api.exchangePlaidToken(publicToken)
          await get().fetchAccounts()
          set({ isLoading: false, plaidLinkToken: null })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      syncPlaidAccounts: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          await api.syncPlaidAccounts()
          await get().fetchAccounts()
          set({ isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      selectAccount: (account) => set({ selectedAccount: account }),
      setDateRange: (range) => set({ dateRange: range }),
      clearFilters: () => set({ dateRange: null }),

      getTotalBalance: () => {
        const { accounts } = get()
        return accounts.reduce((sum, account) => sum + (account.isActive ? account.balance : 0), 0)
      },

      getAccountTypeBreakdown: () => {
        const { accounts } = get()
        return accounts.reduce((breakdown, account) => {
          if (!account.isActive) return breakdown
          breakdown[account.type] = (breakdown[account.type] || 0) + account.balance
          return breakdown
        }, {} as Record<string, number>)
      },

      getMonthlyCashFlow: () => {
        const { transactions, dateRange } = get()
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const monthlyTransactions = transactions.filter(t => {
          const date = new Date(t.date)
          return date >= startOfMonth
        })

        const income = monthlyTransactions
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + t.amount, 0)
        
        const expenses = monthlyTransactions
          .filter(t => t.type === 'debit')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)

        return { income, expenses }
      }
    }),
    { name: 'wealth-store' }
  )
)
