import { BrowserWindow, screen, Tray, Menu, nativeImage, app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

// Track quitting state manually
let isQuitting = false

export class WindowManager {
  private mainWindow: BrowserWindow | null = null
  private tray: Tray | null = null

  async createWindow(): Promise<BrowserWindow> {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    this.mainWindow = new BrowserWindow({
      width: Math.min(1600, width * 0.9),
      height: Math.min(1000, height * 0.9),
      minWidth: 1200,
      minHeight: 800,
      show: false,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 15, y: 10 },
      ...(process.platform === 'linux' ? {} : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false
      }
    })

    // Load content
    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      this.mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    // Window event handlers
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
      this.mainWindow?.focus()
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })

    // Handle window close behavior (minimize to tray on macOS)
    this.mainWindow.on('close', (event) => {
      if (process.platform === 'darwin' && !isQuitting) {
        event.preventDefault()
        this.mainWindow?.hide()
      }
    })

    // Create system tray
    this.createTray()

    return this.mainWindow
  }

  private createTray(): void {
    // Create empty icon for tray (16x16 transparent)
    const trayIcon = nativeImage.createEmpty()
    this.tray = new Tray(trayIcon)
    this.tray.setToolTip('FamilyOfficeOS')

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show FamilyOfficeOS',
        click: () => {
          this.mainWindow?.show()
          this.mainWindow?.focus()
        }
      },
      { type: 'separator' },
      {
        label: 'Sync Now',
        click: () => {
          // Trigger sync
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit()
        }
      }
    ])

    this.tray.setContextMenu(contextMenu)

    this.tray.on('click', () => {
      if (this.mainWindow?.isVisible()) {
        this.mainWindow?.hide()
      } else {
        this.mainWindow?.show()
        this.mainWindow?.focus()
      }
    })
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  sendToRenderer(channel: string, ...args: unknown[]): void {
    this.mainWindow?.webContents.send(channel, ...args)
  }
}