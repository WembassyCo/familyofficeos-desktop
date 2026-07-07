import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type SidebarMode = 'directory' | 'governance' | 'wealth' | 'education'

interface AppState {
  sidebarMode: SidebarMode
  setSidebarMode: (mode: SidebarMode) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      sidebarMode: 'directory',
      setSidebarMode: (mode) => set({ sidebarMode: mode })
    }),
    { name: 'app-store' }
  )
)
