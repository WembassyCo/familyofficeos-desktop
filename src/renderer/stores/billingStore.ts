import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getDirectoryApi } from '../services/api'

export interface Quote {
  id: string
  quoteNumber: string
  opportunityId?: string
  contactId: string
  contactName?: string
  organizationId?: string
  organizationName?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  items: QuoteItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  currency: string
  validUntil?: string
  notes?: string
  terms?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  sentAt?: string
  acceptedAt?: string
}

export interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  discountPercent: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  quoteId?: string
  contactId: string
  contactName?: string
  organizationId?: string
  organizationName?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  shippingAmount: number
  total: number
  currency: string
  shippingAddress?: Address
  billingAddress?: Address
  notes?: string
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
}

export interface OrderItem {
  id: string
  quoteItemId?: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId?: string
  quoteId?: string
  contactId: string
  contactName?: string
  organizationId?: string
  organizationName?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  amountPaid: number
  balanceDue: number
  currency: string
  dueDate: string
  paidAt?: string
  notes?: string
  paymentTerms?: string
  createdAt: string
  updatedAt: string
  sentAt?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface BillingState {
  quotes: Quote[]
  orders: Order[]
  invoices: Invoice[]
  selectedQuote: Quote | null
  selectedOrder: Order | null
  selectedInvoice: Invoice | null
  isLoading: boolean
  error: string | null
  
  // Filters
  statusFilter: string | null
  dateRange: { start?: string; end?: string } | null
  
  // Actions
  fetchQuotes: () => Promise<void>
  fetchOrders: () => Promise<void>
  fetchInvoices: () => Promise<void>
  
  createQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateQuote: (id: string, updates: Partial<Quote>) => Promise<void>
  deleteQuote: (id: string) => Promise<void>
  sendQuote: (id: string) => Promise<void>
  acceptQuote: (id: string) => Promise<void>
  convertQuoteToOrder: (quoteId: string) => Promise<void>
  
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>
  
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  sendInvoice: (id: string) => Promise<void>
  recordPayment: (id: string, amount: number) => Promise<void>
  
  selectQuote: (quote: Quote | null) => void
  selectOrder: (order: Order | null) => void
  selectInvoice: (invoice: Invoice | null) => void
  
  setStatusFilter: (status: string | null) => void
  setDateRange: (range: { start?: string; end?: string } | null) => void
  clearFilters: () => void
}

export const useBillingStore = create<BillingState>()(
  devtools(
    (set, get) => ({
      quotes: [],
      orders: [],
      invoices: [],
      selectedQuote: null,
      selectedOrder: null,
      selectedInvoice: null,
      isLoading: false,
      error: null,
      statusFilter: null,
      dateRange: null,

      fetchQuotes: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const quotes = await api.getQuotes()
          set({ quotes, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchOrders: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const orders = await api.getOrders()
          set({ orders, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchInvoices: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const invoices = await api.getInvoices()
          set({ invoices, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createQuote: async (quote) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newQuote = await api.createQuote(quote)
          set((state) => ({ 
            quotes: [newQuote, ...state.quotes], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateQuote: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateQuote(id, updates)
          set((state) => ({
            quotes: state.quotes.map((q) => (q.id === id ? updated : q)),
            selectedQuote: state.selectedQuote?.id === id ? updated : state.selectedQuote
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteQuote: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteQuote(id)
          set((state) => ({
            quotes: state.quotes.filter((q) => q.id !== id),
            selectedQuote: state.selectedQuote?.id === id ? null : state.selectedQuote
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      sendQuote: async (id) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateQuote(id, { 
            status: 'sent', 
            sentAt: new Date().toISOString() 
          })
          set((state) => ({
            quotes: state.quotes.map((q) => (q.id === id ? updated : q)),
            selectedQuote: state.selectedQuote?.id === id ? updated : state.selectedQuote
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      acceptQuote: async (id) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateQuote(id, { 
            status: 'accepted', 
            acceptedAt: new Date().toISOString() 
          })
          set((state) => ({
            quotes: state.quotes.map((q) => (q.id === id ? updated : q)),
            selectedQuote: state.selectedQuote?.id === id ? updated : state.selectedQuote
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      convertQuoteToOrder: async (quoteId) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const result = await api.convertQuoteToOrder(quoteId)
          set((state) => ({
            quotes: state.quotes.map((q) => 
              q.id === quoteId ? { ...q, status: 'accepted' as const } : q
            ),
            orders: [result.order, ...state.orders],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createOrder: async (order) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newOrder = await api.createOrder(order)
          set((state) => ({ 
            orders: [newOrder, ...state.orders], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateOrder: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateOrder(id, updates)
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? updated : o)),
            selectedOrder: state.selectedOrder?.id === id ? updated : state.selectedOrder
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteOrder: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteOrder(id)
          set((state) => ({
            orders: state.orders.filter((o) => o.id !== id),
            selectedOrder: state.selectedOrder?.id === id ? null : state.selectedOrder
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      updateOrderStatus: async (id, status) => {
        try {
          const api = getDirectoryApi()
          const updates: Partial<Order> = { status }
          if (status === 'shipped') {
            updates.shippedAt = new Date().toISOString()
          } else if (status === 'delivered') {
            updates.deliveredAt = new Date().toISOString()
          }
          const updated = await api.updateOrder(id, updates)
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? updated : o)),
            selectedOrder: state.selectedOrder?.id === id ? updated : state.selectedOrder
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      createInvoice: async (invoice) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newInvoice = await api.createInvoice(invoice)
          set((state) => ({ 
            invoices: [newInvoice, ...state.invoices], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateInvoice: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateInvoice(id, updates)
          set((state) => ({
            invoices: state.invoices.map((i) => (i.id === id ? updated : i)),
            selectedInvoice: state.selectedInvoice?.id === id ? updated : state.selectedInvoice
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteInvoice: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteInvoice(id)
          set((state) => ({
            invoices: state.invoices.filter((i) => i.id !== id),
            selectedInvoice: state.selectedInvoice?.id === id ? null : state.selectedInvoice
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      sendInvoice: async (id) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateInvoice(id, { 
            status: 'sent', 
            sentAt: new Date().toISOString() 
          })
          set((state) => ({
            invoices: state.invoices.map((i) => (i.id === id ? updated : i)),
            selectedInvoice: state.selectedInvoice?.id === id ? updated : state.selectedInvoice
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      recordPayment: async (id, amount) => {
        try {
          const api = getDirectoryApi()
          const invoice = get().invoices.find((i) => i.id === id)
          if (!invoice) return
          
          const newAmountPaid = invoice.amountPaid + amount
          const newBalanceDue = invoice.total - newAmountPaid
          const newStatus = newBalanceDue <= 0 ? 'paid' : invoice.status
          
          const updated = await api.updateInvoice(id, {
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            status: newStatus,
            paidAt: newBalanceDue <= 0 ? new Date().toISOString() : undefined
          })
          
          set((state) => ({
            invoices: state.invoices.map((i) => (i.id === id ? updated : i)),
            selectedInvoice: state.selectedInvoice?.id === id ? updated : state.selectedInvoice
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      selectQuote: (quote) => set({ selectedQuote: quote }),
      selectOrder: (order) => set({ selectedOrder: order }),
      selectInvoice: (invoice) => set({ selectedInvoice: invoice }),

      setStatusFilter: (status) => set({ statusFilter: status }),
      setDateRange: (range) => set({ dateRange: range }),
      clearFilters: () => set({ 
        statusFilter: null, 
        dateRange: null 
      })
    }),
    { name: 'billing-store' }
  )
)