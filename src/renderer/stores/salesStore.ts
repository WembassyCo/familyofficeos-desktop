import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getDirectoryApi } from '../services/api'

export interface Lead {
  id: string
  name: string
  contactId: string
  contactName?: string
  organizationId?: string
  organizationName?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value: number
  currency: string
  probability: number
  expectedCloseDate?: string
  source: string
  assignedTo?: string
  notes?: string
  tags: string[]
  customFields: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Opportunity {
  id: string
  name: string
  leadId: string
  contactId: string
  contactName?: string
  organizationId?: string
  organizationName?: string
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value: number
  currency: string
  probability: number
  expectedCloseDate?: string
  actualCloseDate?: string
  source: string
  assignedTo?: string
  notes?: string
  tags: string[]
  customFields: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

interface SalesState {
  leads: Lead[]
  opportunities: Opportunity[]
  selectedLead: Lead | null
  selectedOpportunity: Opportunity | null
  isLoading: boolean
  error: string | null
  
  // Filters
  statusFilter: Lead['status'] | null
  stageFilter: Opportunity['stage'] | null
  assignedToFilter: string | null
  dateRange: { start?: string; end?: string } | null
  
  // Actions
  fetchLeads: () => Promise<void>
  fetchOpportunities: () => Promise<void>
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  convertLeadToOpportunity: (leadId: string, opportunityData: Partial<Opportunity>) => Promise<void>
  
  createOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>
  deleteOpportunity: (id: string) => Promise<void>
  moveOpportunity: (id: string, newStage: Opportunity['stage']) => Promise<void>
  
  selectLead: (lead: Lead | null) => void
  selectOpportunity: (opp: Opportunity | null) => void
  
  setStatusFilter: (status: Lead['status'] | null) => void
  setStageFilter: (stage: Opportunity['stage'] | null) => void
  setAssignedToFilter: (assignedTo: string | null) => void
  setDateRange: (range: { start?: string; end?: string } | null) => void
  clearFilters: () => void
}

export const useSalesStore = create<SalesState>()(
  devtools(
    (set, get) => ({
      leads: [],
      opportunities: [],
      selectedLead: null,
      selectedOpportunity: null,
      isLoading: false,
      error: null,
      statusFilter: null,
      stageFilter: null,
      assignedToFilter: null,
      dateRange: null,

      fetchLeads: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const leads = await api.getLeads()
          set({ leads, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchOpportunities: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const opportunities = await api.getOpportunities()
          set({ opportunities, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createLead: async (lead) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newLead = await api.createLead(lead)
          set((state) => ({ 
            leads: [newLead, ...state.leads], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateLead: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateLead(id, updates)
          set((state) => ({
            leads: state.leads.map((l) => (l.id === id ? updated : l)),
            selectedLead: state.selectedLead?.id === id ? updated : state.selectedLead
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteLead: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteLead(id)
          set((state) => ({
            leads: state.leads.filter((l) => l.id !== id),
            selectedLead: state.selectedLead?.id === id ? null : state.selectedLead
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      convertLeadToOpportunity: async (leadId, opportunityData) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const result = await api.convertLead(leadId, opportunityData)
          set((state) => ({
            leads: state.leads.map((l) => 
              l.id === leadId ? { ...l, status: 'closed_won' as const } : l
            ),
            opportunities: [result.opportunity, ...state.opportunities],
            isLoading: false
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createOpportunity: async (opp) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newOpp = await api.createOpportunity(opp)
          set((state) => ({ 
            opportunities: [newOpp, ...state.opportunities], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateOpportunity: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateOpportunity(id, updates)
          set((state) => ({
            opportunities: state.opportunities.map((o) => 
              o.id === id ? updated : o
            ),
            selectedOpportunity: state.selectedOpportunity?.id === id 
              ? updated 
              : state.selectedOpportunity
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteOpportunity: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteOpportunity(id)
          set((state) => ({
            opportunities: state.opportunities.filter((o) => o.id !== id),
            selectedOpportunity: state.selectedOpportunity?.id === id 
              ? null 
              : state.selectedOpportunity
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      moveOpportunity: async (id, newStage) => {
        try {
          const api = getDirectoryApi()
          const updates: Partial<Opportunity> = { stage: newStage }
          if (newStage === 'closed_won' || newStage === 'closed_lost') {
            updates.actualCloseDate = new Date().toISOString()
          }
          const updated = await api.updateOpportunity(id, updates)
          set((state) => ({
            opportunities: state.opportunities.map((o) => 
              o.id === id ? updated : o
            )
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      selectLead: (lead) => set({ selectedLead: lead }),
      selectOpportunity: (opp) => set({ selectedOpportunity: opp }),

      setStatusFilter: (status) => set({ statusFilter: status }),
      setStageFilter: (stage) => set({ stageFilter: stage }),
      setAssignedToFilter: (assignedTo) => set({ assignedToFilter: assignedTo }),
      setDateRange: (range) => set({ dateRange: range }),
      clearFilters: () => set({ 
        statusFilter: null, 
        stageFilter: null, 
        assignedToFilter: null, 
        dateRange: null 
      })
    }),
    { name: 'sales-store' }
  )
)