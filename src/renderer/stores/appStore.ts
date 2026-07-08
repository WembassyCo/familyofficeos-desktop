import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  selectedTenant: string | null
  showTenantSelect: boolean
  sidebarMode: string
  selectTenant: (tenantId: string) => void
  setShowTenantSelect: (show: boolean) => void
  setSidebarMode: (mode: string) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      selectedTenant: null,
      showTenantSelect: true,
      sidebarMode: 'directory',
      selectTenant: (tenantId) => set({ selectedTenant: tenantId }),
      setShowTenantSelect: (show) => set({ showTenantSelect: show }),
      setSidebarMode: (mode) => set({ sidebarMode: mode }),
    }),
    { name: 'app-store' }
  )
)
