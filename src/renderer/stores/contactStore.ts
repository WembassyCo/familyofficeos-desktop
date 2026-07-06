import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { apiClient } from '../services/api'

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  organizationId?: string
  organizationName?: string
  tags: string[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  contactCount?: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

interface ContactState {
  // Data
  contacts: Contact[]
  organizations: Organization[]
  selectedContact: Contact | null
  selectedOrganization: Organization | null
  
  // Loading states
  isLoadingContacts: boolean
  isLoadingOrganizations: boolean
  isSaving: boolean
  
  // Filters
  searchQuery: string
  statusFilter: string | null
  organizationFilter: string | null
  
  // Pagination
  currentPage: number
  totalPages: number
  totalCount: number
  
  // Errors
  error: string | null
  
  // Actions
  fetchContacts: (page?: number, limit?: number) => Promise<void>
  fetchOrganizations: (page?: number, limit?: number) => Promise<void>
  getContact: (id: string) => Promise<Contact | null>
  getOrganization: (id: string) => Promise<Organization | null>
  createContact: (data: Partial<Contact>) => Promise<Contact | null>
  updateContact: (id: string, data: Partial<Contact>) => Promise<Contact | null>
  deleteContact: (id: string) => Promise<boolean>
  createOrganization: (data: Partial<Organization>) => Promise<Organization | null>
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<Organization | null>
  deleteOrganization: (id: string) => Promise<boolean>
  
  // Selection
  selectContact: (contact: Contact | null) => void
  selectOrganization: (org: Organization | null) => void
  
  // Filters
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string | null) => void
  setOrganizationFilter: (orgId: string | null) => void
  clearFilters: () => void
  
  // Error
  clearError: () => void
}

export const useContactStore = create<ContactState>()(
  devtools(
    (set, get) => ({
      contacts: [],
      organizations: [],
      selectedContact: null,
      selectedOrganization: null,
      isLoadingContacts: false,
      isLoadingOrganizations: false,
      isSaving: false,
      searchQuery: '',
      statusFilter: null,
      organizationFilter: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      error: null,

      fetchContacts: async (page = 1, limit = 25) => {
        set({ isLoadingContacts: true, error: null })
        
        try {
          const { searchQuery, statusFilter } = get()
          const params: any = { page, limit }
          
          if (searchQuery) params.search = searchQuery
          if (statusFilter) params.status = statusFilter
          
          const api = apiClient.getDirectoryApi()
          const response = await api.getContacts(params)
          
          // Map organizations to contacts
          const { organizations } = get()
          const contactsWithOrgs = response.data.map((contact: any) => ({
            ...contact,
            organizationName: organizations.find(o => o.id === contact.organizationId)?.name
          }))
          
          set({
            contacts: contactsWithOrgs,
            currentPage: page,
            totalPages: Math.ceil((response.meta?.total || 0) / limit),
            totalCount: response.meta?.total || 0,
            isLoadingContacts: false,
          })
        } catch (err: any) {
          set({
            error: err.message || 'Failed to fetch contacts',
            isLoadingContacts: false,
          })
        }
      },

      fetchOrganizations: async (page = 1, limit = 25) => {
        set({ isLoadingOrganizations: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          const response = await api.getOrganizations({ page, limit })
          
          set({
            organizations: response.data,
            isLoadingOrganizations: false,
          })
        } catch (err: any) {
          set({
            error: err.message || 'Failed to fetch organizations',
            isLoadingOrganizations: false,
          })
        }
      },

      getContact: async (id: string) => {
        try {
          const api = apiClient.getDirectoryApi()
          const contact = await api.getContact(id)
          return contact
        } catch (err: any) {
          set({ error: err.message })
          return null
        }
      },

      getOrganization: async (id: string) => {
        try {
          const api = apiClient.getDirectoryApi()
          const org = await api.getOrganization(id)
          return org
        } catch (err: any) {
          set({ error: err.message })
          return null
        }
      },

      createContact: async (data: Partial<Contact>) => {
        set({ isSaving: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          const contact = await api.createContact(data)
          
          // Refresh list
          await get().fetchContacts()
          
          set({ isSaving: false })
          return contact
        } catch (err: any) {
          set({
            error: err.message || 'Failed to create contact',
            isSaving: false,
          })
          return null
        }
      },

      updateContact: async (id: string, data: Partial<Contact>) => {
        set({ isSaving: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          const contact = await api.updateContact(id, data)
          
          // Refresh list
          await get().fetchContacts()
          
          // Update selected contact if it's the same
          const { selectedContact } = get()
          if (selectedContact?.id === id) {
            set({ selectedContact: contact })
          }
          
          set({ isSaving: false })
          return contact
        } catch (err: any) {
          set({
            error: err.message || 'Failed to update contact',
            isSaving: false,
          })
          return null
        }
      },

      deleteContact: async (id: string) => {
        set({ isSaving: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          await api.deleteContact(id)
          
          // Refresh list
          await get().fetchContacts()
          
          // Clear selection if deleted
          const { selectedContact } = get()
          if (selectedContact?.id === id) {
            set({ selectedContact: null })
          }
          
          set({ isSaving: false })
          return true
        } catch (err: any) {
          set({
            error: err.message || 'Failed to delete contact',
            isSaving: false,
          })
          return false
        }
      },

      createOrganization: async (data: Partial<Organization>) => {
        set({ isSaving: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          const org = await api.createOrganization(data)
          
          // Refresh list
          await get().fetchOrganizations()
          
          set({ isSaving: false })
          return org
        } catch (err: any) {
          set({
            error: err.message || 'Failed to create organization',
            isSaving: false,
          })
          return null
        }
      },

      updateOrganization: async (id: string, data: Partial<Organization>) => {
        set({ isSaving: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          const org = await api.updateOrganization(id, data)
          
          // Refresh list
          await get().fetchOrganizations()
          
          // Update selected if same
          const { selectedOrganization } = get()
          if (selectedOrganization?.id === id) {
            set({ selectedOrganization: org })
          }
          
          set({ isSaving: false })
          return org
        } catch (err: any) {
          set({
            error: err.message || 'Failed to update organization',
            isSaving: false,
          })
          return null
        }
      },

      deleteOrganization: async (id: string) => {
        set({ isSaving: true, error: null })
        
        try {
          const api = apiClient.getDirectoryApi()
          await api.deleteOrganization(id)
          
          // Refresh list
          await get().fetchOrganizations()
          
          const { selectedOrganization } = get()
          if (selectedOrganization?.id === id) {
            set({ selectedOrganization: null })
          }
          
          set({ isSaving: false })
          return true
        } catch (err: any) {
          set({
            error: err.message || 'Failed to delete organization',
            isSaving: false,
          })
          return false
        }
      },

      selectContact: (contact) => set({ selectedContact: contact }),
      selectOrganization: (org) => set({ selectedOrganization: org }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setOrganizationFilter: (orgId) => set({ organizationFilter: orgId }),
      
      clearFilters: () => set({
        searchQuery: '',
        statusFilter: null,
        organizationFilter: null,
      }),
      
      clearError: () => set({ error: null }),
    }),
    { name: 'ContactStore' }
  )
)