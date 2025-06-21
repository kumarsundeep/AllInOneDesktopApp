import { app, BrowserWindow, ipcMain } from 'electron'
import electronDebug from 'electron-debug'
import electronContextMenu from 'electron-context-menu'
import unhandled from 'electron-unhandled'
import pkg from 'electron-updater'
const { autoUpdater } = pkg
import Store from 'electron-store'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Initialize debugging and context menu
electronDebug()
electronContextMenu()
unhandled()

// Initialize config store
const store = new Store()

// Global reference to mainWindow
let mainWindow

// Create the browser window
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    show: false,
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // Use Vite dev server in development
    await mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // Use built files in production
    await mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }

  // Show window once content is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (process.env.NODE_ENV === 'production') {
      autoUpdater.checkForUpdatesAndNotify()
    }
  })

  // Memory usage tracking
  setInterval(() => {
    const memoryUsage = process.memoryUsage()
    mainWindow.webContents.send('memory-usage', memoryUsage)
  }, 5000)
}

// Theme management
ipcMain.handle('getTheme', () => {
  return store.get('theme', 'light')
})

ipcMain.on('setTheme', (event, theme) => {
  store.set('theme', theme)
  mainWindow.webContents.send('theme-changed', theme)
})

// App lifecycle
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Auto-updater events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall()
})
