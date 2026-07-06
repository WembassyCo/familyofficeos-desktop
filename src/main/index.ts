import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { WindowManager } from './services/windowManager'
import { AuthService } from './services/auth'
import { SecureStorage } from './services/secureStorage'
import { DatabaseService } from './services/database'
import { SyncEngine } from './services/sync'
import { NotificationService } from './services/notifications'
import { AutoUpdateService } from './services/autoUpdate'

class FamilyOfficeOSApp {
  private windowManager: WindowManager
  private authService: AuthService
  private secureStorage: SecureStorage
  private database: DatabaseService
  private syncEngine: SyncEngine
  private notifications: NotificationService
  private autoUpdate: AutoUpdateService

  constructor() {
    this.windowManager = new WindowManager()
    this.secureStorage = new SecureStorage()
    this.database = new DatabaseService()
    this.authService = new AuthService(this.secureStorage)
    this.syncEngine = new SyncEngine(this.database)
    this.notifications = new NotificationService()
    this.autoUpdate = new AutoUpdateService()
  }

  async initialize(): Promise<void> {
    // Initialize database
    await this.database.initialize()

    // Set up IPC handlers
    this.setupIpcHandlers()

    // Check for updates
    if (!is.dev) {
      this.autoUpdate.checkForUpdates()
    }
  }

  private setupIpcHandlers(): void {
    // Auth IPC handlers
    ipcMain.handle('auth:login', async (_, credentials) => {
      return this.authService.login(credentials)
    })

    ipcMain.handle('auth:logout', async () => {
      return this.authService.logout()
    })

    ipcMain.handle('auth:check', async () => {
      return this.authService.checkSession()
    })

    ipcMain.handle('auth:biometric', async () => {
      return this.authService.unlockWithBiometrics()
    })

    // Secure storage IPC handlers
    ipcMain.handle('secure:get', async (_, key) => {
      return this.secureStorage.get(key)
    })

    ipcMain.handle('secure:set', async (_, key, value) => {
      return this.secureStorage.set(key, value)
    })

    ipcMain.handle('secure:delete', async (_, key) => {
      return this.secureStorage.delete(key)
    })

    // Database IPC handlers
    ipcMain.handle('db:query', async (_, sql, params) => {
      return this.database.query(sql, params)
    })

    ipcMain.handle('db:insert', async (_, table, data) => {
      return this.database.insert(table, data)
    })

    ipcMain.handle('db:update', async (_, table, id, data) => {
      return this.database.update(table, id, data)
    })

    ipcMain.handle('db:delete', async (_, table, id) => {
      return this.database.delete(table, id)
    })

    // Sync IPC handlers
    ipcMain.handle('sync:status', () => {
      return this.syncEngine.getStatus()
    })

    ipcMain.handle('sync:force', async () => {
      return this.syncEngine.forceSync()
    })

    ipcMain.handle('sync:queue', async (_, operation) => {
      return this.syncEngine.queueOperation(operation)
    })

    // Notification IPC handlers
    ipcMain.handle('notification:show', async (_, options) => {
      return this.notifications.show(options)
    })

    // Window IPC handlers
    ipcMain.handle('window:minimize', () => {
      const window = BrowserWindow.getFocusedWindow()
      window?.minimize()
    })

    ipcMain.handle('window:maximize', () => {
      const window = BrowserWindow.getFocusedWindow()
      if (window?.isMaximized()) {
        window?.unmaximize()
      } else {
        window?.maximize()
      }
    })

    ipcMain.handle('window:close', () => {
      const window = BrowserWindow.getFocusedWindow()
      window?.close()
    })

    // Deep link handlers
    ipcMain.handle('deeplink:open', async (_, url) => {
      shell.openExternal(url)
    })

    // Theme IPC handlers
    ipcMain.handle('theme:get', () => {
      return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    })

    ipcMain.handle('theme:set', (_, theme) => {
      nativeTheme.themeSource = theme
    })
  }

  async createWindow(): Promise<void> {
    await this.windowManager.createWindow()
  }
}

// Initialize app
const familyOfficeApp = new FamilyOfficeOSApp()

// App event handlers
app.whenReady().then(async () => {
  // Set app user model id for Windows
  electronApp.setAppUserModelId('com.wembassy.familyofficeos')

  // Watch for shortcuts in dev mode
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize services
  await familyOfficeApp.initialize()

  // Create main window
  await familyOfficeApp.createWindow()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await familyOfficeApp.createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.on('new-window', (event) => {
    event.preventDefault()
  })

  // Security: Prevent navigation to external sites in main window
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    if (parsedUrl.origin !== 'http://localhost') {
      event.preventDefault()
      shell.openExternal(navigationUrl)
    }
  })
})