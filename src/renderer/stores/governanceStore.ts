import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getDirectoryApi } from '../services/api'

export interface Decision {
  id: string
  title: string
  description: string
  category: 'investment' | 'operations' | 'governance' | 'philanthropy' | 'estate' | 'other'
  status: 'draft' | 'open' | 'voting' | 'closed' | 'implemented' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  proposedBy: string
  proposedByName?: string
  proposedAt: string
  votingDeadline?: string
  implementedAt?: string
  votes: Vote[]
  voteSummary: {
    for: number
    against: number
    abstain: number
    totalVoters: number
    quorumMet: boolean
  }
  attachments: Attachment[]
  comments: Comment[]
  relatedEntities: RelatedEntity[]
  createdAt: string
  updatedAt: string
}

export interface Vote {
  id: string
  decisionId: string
  voterId: string
  voterName?: string
  vote: 'for' | 'against' | 'abstain'
  comment?: string
  votedAt: string
  weight?: number
}

export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  mimeType: string
  uploadedAt: string
}

export interface Comment {
  id: string
  authorId: string
  authorName?: string
  content: string
  createdAt: string
}

export interface RelatedEntity {
  id: string
  type: 'contact' | 'organization' | 'project' | 'investment'
  name: string
}

export interface Meeting {
  id: string
  title: string
  description?: string
  type: 'board' | 'family' | 'investment' | 'advisory' | 'other'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledAt: string
  duration: number // in minutes
  location?: string
  virtualLink?: string
  attendees: Attendee[]
  agenda: AgendaItem[]
  decisions: string[] // decision IDs
  minutes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Attendee {
  id: string
  name: string
  email?: string
  role: 'voting' | 'observer' | 'guest'
  status: 'invited' | 'confirmed' | 'declined' | 'tentative'
  attended: boolean
}

export interface AgendaItem {
  id: string
  title: string
  description?: string
  duration: number
  presenter?: string
  decisionId?: string
  order: number
}

interface GovernanceState {
  decisions: Decision[]
  meetings: Meeting[]
  selectedDecision: Decision | null
  selectedMeeting: Meeting | null
  isLoading: boolean
  error: string | null
  
  // Filters
  statusFilter: string | null
  categoryFilter: string | null
  priorityFilter: string | null
  dateRange: { start?: string; end?: string } | null
  
  // Actions
  fetchDecisions: () => Promise<void>
  fetchMeetings: () => Promise<void>
  fetchDecision: (id: string) => Promise<void>
  fetchMeeting: (id: string) => Promise<void>
  
  createDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'voteSummary'>) => Promise<void>
  updateDecision: (id: string, updates: Partial<Decision>) => Promise<void>
  deleteDecision: (id: string) => Promise<void>
  openVoting: (id: string, votingDeadline: string) => Promise<void>
  closeVoting: (id: string) => Promise<void>
  implementDecision: (id: string) => Promise<void>
  rejectDecision: (id: string) => Promise<void>
  
  castVote: (decisionId: string, vote: 'for' | 'against' | 'abstain', comment?: string) => Promise<void>
  addComment: (decisionId: string, content: string) => Promise<void>
  
  createMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>
  deleteMeeting: (id: string) => Promise<void>
  startMeeting: (id: string) => Promise<void>
  completeMeeting: (id: string, minutes: string) => Promise<void>
  updateAttendance: (meetingId: string, attendeeId: string, attended: boolean) => Promise<void>
  
  selectDecision: (decision: Decision | null) => void
  selectMeeting: (meeting: Meeting | null) => void
  
  setStatusFilter: (status: string | null) => void
  setCategoryFilter: (category: string | null) => void
  setPriorityFilter: (priority: string | null) => void
  setDateRange: (range: { start?: string; end?: string } | null) => void
  clearFilters: () => void
}

export const useGovernanceStore = create<GovernanceState>()(
  devtools(
    (set, get) => ({
      decisions: [],
      meetings: [],
      selectedDecision: null,
      selectedMeeting: null,
      isLoading: false,
      error: null,
      statusFilter: null,
      categoryFilter: null,
      priorityFilter: null,
      dateRange: null,

      fetchDecisions: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const response = await api.getDecisions()
          set({ decisions: response.data || [], isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchMeetings: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const response = await api.getMeetings()
          set({ meetings: response.data || [], isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchDecision: async (id) => {
        try {
          const api = getDirectoryApi()
          const decision = await api.getDecision(id)
          set((state) => ({
            decisions: state.decisions.map((d) => (d.id === id ? decision : d)),
            selectedDecision: state.selectedDecision?.id === id ? decision : state.selectedDecision
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      fetchMeeting: async (id) => {
        try {
          const api = getDirectoryApi()
          const meeting = await api.getMeeting(id)
          set((state) => ({
            meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
            selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      createDecision: async (decision) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newDecision = await api.createDecision(decision)
          set((state) => ({ 
            decisions: [newDecision, ...state.decisions], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateDecision: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateDecision(id, updates)
          set((state) => ({
            decisions: state.decisions.map((d) => (d.id === id ? updated : d)),
            selectedDecision: state.selectedDecision?.id === id ? updated : state.selectedDecision
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteDecision: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteDecision(id)
          set((state) => ({
            decisions: state.decisions.filter((d) => d.id !== id),
            selectedDecision: state.selectedDecision?.id === id ? null : state.selectedDecision
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      openVoting: async (id, votingDeadline) => {
        await get().updateDecision(id, { status: 'voting', votingDeadline })
      },

      closeVoting: async (id) => {
        await get().updateDecision(id, { status: 'closed' })
      },

      implementDecision: async (id) => {
        await get().updateDecision(id, { status: 'implemented', implementedAt: new Date().toISOString() })
      },

      rejectDecision: async (id) => {
        await get().updateDecision(id, { status: 'rejected' })
      },

      castVote: async (decisionId, vote, comment) => {
        try {
          const api = getDirectoryApi()
          await api.castVote(decisionId, { vote, comment })
          await get().fetchDecision(decisionId)
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      addComment: async (decisionId, content) => {
        try {
          const api = getDirectoryApi()
          await api.addDecisionComment(decisionId, { content })
          await get().fetchDecision(decisionId)
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      createMeeting: async (meeting) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newMeeting = await api.createMeeting(meeting)
          set((state) => ({ 
            meetings: [newMeeting, ...state.meetings], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateMeeting: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateMeeting(id, updates)
          set((state) => ({
            meetings: state.meetings.map((m) => (m.id === id ? updated : m)),
            selectedMeeting: state.selectedMeeting?.id === id ? updated : state.selectedMeeting
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteMeeting: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteMeeting(id)
          set((state) => ({
            meetings: state.meetings.filter((m) => m.id !== id),
            selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      startMeeting: async (id) => {
        await get().updateMeeting(id, { status: 'in_progress' })
      },

      completeMeeting: async (id, minutes) => {
        await get().updateMeeting(id, { status: 'completed', minutes })
      },

      updateAttendance: async (meetingId, attendeeId, attended) => {
        try {
          const api = getDirectoryApi()
          await api.updateAttendance(meetingId, attendeeId, attended)
          await get().fetchMeeting(meetingId)
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      selectDecision: (decision) => set({ selectedDecision: decision }),
      selectMeeting: (meeting) => set({ selectedMeeting: meeting }),

      setStatusFilter: (status) => set({ statusFilter: status }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setDateRange: (range) => set({ dateRange: range }),
      clearFilters: () => set({ 
        statusFilter: null, 
        categoryFilter: null,
        priorityFilter: null,
        dateRange: null 
      })
    }),
    { name: 'governance-store' }
  )
)