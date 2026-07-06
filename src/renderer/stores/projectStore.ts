import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getDirectoryApi } from '../services/api'

export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate?: string
  dueDate?: string
  completedAt?: string
  progress: number // 0-100
  budget?: number
  spent?: number
  clientId?: string
  clientName?: string
  assignedTo?: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  name: string
  description?: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  assignedToName?: string
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours: number
  parentTaskId?: string
  subtasks: Task[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface TimeEntry {
  id: string
  taskId: string
  taskName?: string
  projectId: string
  projectName?: string
  userId: string
  userName?: string
  description?: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  billable: boolean
  hourlyRate?: number
  createdAt: string
}

interface ProjectState {
  projects: Project[]
  tasks: Task[]
  timeEntries: TimeEntry[]
  selectedProject: Project | null
  selectedTask: Task | null
  isLoading: boolean
  error: string | null
  
  // Filters
  statusFilter: string | null
  priorityFilter: string | null
  assignedToFilter: string | null
  dateRange: { start?: string; end?: string } | null
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchTasks: (projectId?: string) => Promise<void>
  fetchTimeEntries: (params?: { projectId?: string; taskId?: string; startDate?: string; endDate?: string }) => Promise<void>
  
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  updateProjectProgress: (id: string) => Promise<void>
  
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'actualHours'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (taskId: string, newStatus: Task['status']) => Promise<void>
  reorderTasks: (projectId: string, taskIds: string[]) => Promise<void>
  
  startTimeEntry: (taskId: string, description?: string) => Promise<void>
  stopTimeEntry: (entryId: string) => Promise<void>
  createTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>
  deleteTimeEntry: (id: string) => Promise<void>
  
  selectProject: (project: Project | null) => void
  selectTask: (task: Task | null) => void
  
  setStatusFilter: (status: string | null) => void
  setPriorityFilter: (priority: string | null) => void
  setAssignedToFilter: (assignedTo: string | null) => void
  setDateRange: (range: { start?: string; end?: string } | null) => void
  clearFilters: () => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      projects: [],
      tasks: [],
      timeEntries: [],
      selectedProject: null,
      selectedTask: null,
      isLoading: false,
      error: null,
      statusFilter: null,
      priorityFilter: null,
      assignedToFilter: null,
      dateRange: null,

      fetchProjects: async () => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const projects = await api.getProjects()
          set({ projects, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchTasks: async (projectId) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const params = projectId ? { projectId } : undefined
          const tasks = await api.getTasks(params)
          set({ tasks, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      fetchTimeEntries: async (params) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const entries = await api.getTimeEntries(params)
          set({ timeEntries: entries, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      createProject: async (project) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newProject = await api.createProject(project)
          set((state) => ({ 
            projects: [newProject, ...state.projects], 
            isLoading: false 
          }))
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateProject: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const updated = await api.updateProject(id, updates)
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? updated : p)),
            selectedProject: state.selectedProject?.id === id ? updated : state.selectedProject
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteProject: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteProject(id)
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            selectedProject: state.selectedProject?.id === id ? null : state.selectedProject
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      updateProjectProgress: async (id) => {
        const { tasks } = get()
        const projectTasks = tasks.filter((t) => t.projectId === id)
        if (projectTasks.length === 0) return
        
        const completedTasks = projectTasks.filter((t) => t.status === 'done').length
        const progress = Math.round((completedTasks / projectTasks.length) * 100)
        
        await get().updateProject(id, { progress })
      },

      createTask: async (task) => {
        set({ isLoading: true, error: null })
        try {
          const api = getDirectoryApi()
          const newTask = await api.createTask(task)
          set((state) => ({ 
            tasks: [...state.tasks, newTask], 
            isLoading: false 
          }))
          // Update project progress
          await get().updateProjectProgress(task.projectId)
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      updateTask: async (id, updates) => {
        try {
          const api = getDirectoryApi()
          const task = get().tasks.find((t) => t.id === id)
          if (!task) return
          
          const updated = await api.updateTask(id, updates)
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
            selectedTask: state.selectedTask?.id === id ? updated : state.selectedTask
          }))
          // Update project progress if status changed
          if (updates.status) {
            await get().updateProjectProgress(task.projectId)
          }
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteTask: async (id) => {
        try {
          const api = getDirectoryApi()
          const task = get().tasks.find((t) => t.id === id)
          await api.deleteTask(id)
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
          }))
          if (task) {
            await get().updateProjectProgress(task.projectId)
          }
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      moveTask: async (taskId, newStatus) => {
        const { tasks } = get()
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return
        
        const updates: Partial<Task> = { status: newStatus }
        if (newStatus === 'done') {
          updates.completedAt = new Date().toISOString()
        }
        await get().updateTask(taskId, updates)
      },

      reorderTasks: async (projectId, taskIds) => {
        try {
          const api = getDirectoryApi()
          await api.reorderTasks(projectId, taskIds)
          // Refetch tasks to get updated order
          await get().fetchTasks(projectId)
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      startTimeEntry: async (taskId, description) => {
        try {
          const api = getDirectoryApi()
          const { tasks } = get()
          const task = tasks.find((t) => t.id === taskId)
          const project = get().projects.find((p) => p.id === task?.projectId)
          
          const entry = await api.createTimeEntry({
            taskId,
            projectId: task?.projectId || '',
            description,
            startTime: new Date().toISOString(),
            duration: 0,
            billable: true,
          })
          
          set((state) => ({
            timeEntries: [entry, ...state.timeEntries]
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      stopTimeEntry: async (entryId) => {
        try {
          const api = getDirectoryApi()
          const entry = get().timeEntries.find((e) => e.id === entryId)
          if (!entry) return
          
          const endTime = new Date().toISOString()
          const start = new Date(entry.startTime)
          const end = new Date(endTime)
          const duration = Math.round((end.getTime() - start.getTime()) / 60000) // minutes
          
          const updated = await api.updateTimeEntry(entryId, { endTime, duration })
          
          set((state) => ({
            timeEntries: state.timeEntries.map((e) => 
              e.id === entryId ? updated : e
            )
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      createTimeEntry: async (entry) => {
        try {
          const api = getDirectoryApi()
          const newEntry = await api.createTimeEntry(entry)
          set((state) => ({
            timeEntries: [newEntry, ...state.timeEntries]
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      deleteTimeEntry: async (id) => {
        try {
          const api = getDirectoryApi()
          await api.deleteTimeEntry(id)
          set((state) => ({
            timeEntries: state.timeEntries.filter((e) => e.id !== id)
          }))
        } catch (error) {
          set({ error: (error as Error).message })
        }
      },

      selectProject: (project) => set({ selectedProject: project }),
      selectTask: (task) => set({ selectedTask: task }),

      setStatusFilter: (status) => set({ statusFilter: status }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setAssignedToFilter: (assignedTo) => set({ assignedToFilter: assignedTo }),
      setDateRange: (range) => set({ dateRange: range }),
      clearFilters: () => set({ 
        statusFilter: null, 
        priorityFilter: null,
        assignedToFilter: null,
        dateRange: null 
      })
    }),
    { name: 'project-store' }
  )
)