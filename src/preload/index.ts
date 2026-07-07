import { contextBridge, ipcRenderer } from 'electron'

// API exposed to renderer process
const electronAPI = {
  // Auth
  auth: {
    login: (credentials: { username: string; password: string }) =>
      ipcRenderer.invoke('auth:login', credentials),
    logout: () => ipcRenderer.invoke('auth:logout'),
    check: () => ipcRenderer.invoke('auth:check'),
    biometricUnlock: () => ipcRenderer.invoke('auth:biometric'),
  },

  // Secure Storage
  secureStorage: {
    get: (key: string) => ipcRenderer.invoke('secure:get', key),
    set: (key: string, value: string) => ipcRenderer.invoke('secure:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('secure:delete', key),
  },

  // Database (local cache)
  db: {
    query: (sql: string, params?: unknown[]) => ipcRenderer.invoke('db:query', sql, params),
    insert: (table: string, data: Record<string, unknown>) => ipcRenderer.invoke('db:insert', table, data),
    update: (table: string, id: string, data: Record<string, unknown>) => ipcRenderer.invoke('db:update', table, id, data),
    delete: (table: string, id: string) => ipcRenderer.invoke('db:delete', table, id),
  },

  // Sync
  sync: {
    status: () => ipcRenderer.invoke('sync:status'),
    force: () => ipcRenderer.invoke('sync:force'),
    queue: (operation: unknown) => ipcRenderer.invoke('sync:queue', operation),
  },

  // Notifications
  notifications: {
    show: (options: { title: string; body: string }) => ipcRenderer.invoke('notification:show', options),
  },

  // Window
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  // External links
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke('deeplink:open', url),
  },

  // Theme
  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    set: (theme: 'light' | 'dark' | 'system') => ipcRenderer.invoke('theme:set', theme),
  },

  // Event listeners (from main to renderer)
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const subscription = (_event: unknown, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

// Expose the API to the renderer
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type declarations for TypeScript
declare global {
  interface Window {
    electronAPI: typeof electronAPI
  }
}