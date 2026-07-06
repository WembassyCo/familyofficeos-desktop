import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_BASE_URL = 'https://fos.wembassy.com'

class ApiClient {
  private client: AxiosInstance
  private containerName: string = ''

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // Request interceptor to add session cookie
    this.client.interceptors.request.use(async (config) => {
      // Get session from main process
      const sessionCookie = await window.electronAPI.secureStorage.get('sessionCookie')
      if (sessionCookie) {
        config.headers.Cookie = sessionCookie
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Session expired, clear auth
          await window.electronAPI.auth.logout()
          window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }

  setContainer(containerName: string): void {
    this.containerName = containerName
  }

  getContainer(): string {
    return this.containerName
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  // Directory API
  getDirectoryApi() {
    const base = `/fox-daemon/api/directory/${this.containerName}`
    return {
      // Contacts
      getContacts: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
        this.get<{ data: any[]; meta: any }>(`${base}/contacts`, { params }),
      
      getContact: (id: string) =>
        this.get<any>(`${base}/contacts/${id}`),
      
      createContact: (data: any) =>
        this.post<any>(`${base}/contacts`, data),
      
      updateContact: (id: string, data: any) =>
        this.put<any>(`${base}/contacts/${id}`, data),
      
      deleteContact: (id: string) =>
        this.delete<void>(`${base}/contacts/${id}`),

      // Organizations
      getOrganizations: (params?: { search?: string; industry?: string; page?: number; limit?: number }) =>
        this.get<{ data: any[]; meta: any }>(`${base}/organizations`, { params }),
      
      getOrganization: (id: string) =>
        this.get<any>(`${base}/organizations/${id}`),
      
      createOrganization: (data: any) =>
        this.post<any>(`${base}/organizations`, data),
      
      updateOrganization: (id: string, data: any) =>
        this.put<any>(`${base}/organizations/${id}`, data),
      
      deleteOrganization: (id: string) =>
        this.delete<void>(`${base}/organizations/${id}`),

      // Leads
      getLeads: (params?: { status?: string; page?: number; limit?: number }) =>
        this.get<{ data: any[]; meta: any }>(`${base}/leads`, { params }),
      
      createLead: (data: any) =>
        this.post<any>(`${base}/leads`, data),
      
      updateLead: (id: string, data: any) =>
        this.put<any>(`${base}/leads/${id}`, data),

      // CSV Import
      importCsv: (formData: FormData) =>
        this.post<any>(`${base}/import/csv`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
    }
  }

  // Governance API
  getGovernanceApi() {
    const base = `/fox-daemon/api/governance/${this.containerName}`
    return {
      getDecisions: (params?: { status?: string; page?: number; limit?: number }) =>
        this.get<{ data: any[]; meta: any }>(`${base}/decisions`, { params }),
      
      getDecision: (id: string) =>
        this.get<any>(`${base}/decisions/${id}`),
      
      createDecision: (data: any) =>
        this.post<any>(`${base}/decisions`, data),
      
      castVote: (decisionId: string, vote: any) =>
        this.post<any>(`${base}/decisions/${decisionId}/votes`, vote),

      getMeetings: (params?: { status?: string; page?: number; limit?: number }) =>
        this.get<{ data: any[]; meta: any }>(`${base}/meetings`, { params }),
      
      createMeeting: (data: any) =>
        this.post<any>(`${base}/meetings`, data),
    }
  }

  // Wealth API
  getWealthApi() {
    return {
      getAccounts: () =>
        this.get<any[]>('/api/wealth/accounts'),
      
      getTransactions: (accountId: string, params?: any) =>
        this.get<any[]>(`/api/wealth/accounts/${accountId}/transactions`, { params }),
      
      getHoldings: (accountId: string) =>
        this.get<any[]>(`/api/wealth/accounts/${accountId}/holdings`),
      
      getPortfolio: () =>
        this.get<any>('/api/wealth/portfolio'),
      
      getAssets: (params?: { type?: string }) =>
        this.get<any[]>('/api/wealth/assets', { params }),
      
      createPlaidLink: () =>
        this.post<{ link_token: string }>('/api/wealth/plaid/link-token'),
    }
  }

  // Education API
  getEducationApi() {
    const v2Base = `/api/v2/fos/${this.containerName}/education`
    return {
      getCourses: (params?: { status?: string; page?: number; limit?: number }) =>
        this.get<{ data: any[]; meta: any }>(`${v2Base}/courses`, { params }),
      
      getCourse: (id: string) =>
        this.get<any>(`${v2Base}/courses/${id}`),
      
      createCourse: (data: any) =>
        this.post<any>(`${v2Base}/courses`, data),
      
      updateCourse: (id: string, data: any) =>
        this.put<any>(`${v2Base}/courses/${id}`, data),
      
      deleteCourse: (id: string) =>
        this.delete<void>(`${v2Base}/courses/${id}`),

      // AI Generation
      researchCourse: (topic: string) =>
        this.post<any>(`${v2Base}/generate-course/research`, { topic }),
      
      generateOutline: (researchId: string) =>
        this.post<any>(`${v2Base}/generate-course/outline`, { research_id: researchId }),
      
      generateContent: (outlineId: string) =>
        this.post<any>(`${v2Base}/generate-course/content`, { outline_id: outlineId }),
      
      getGenerationStatus: (jobId: string) =>
        this.get<any>(`${v2Base}/generate-course/status/${jobId}`),
    }
  }
}

export const apiClient = new ApiClient()