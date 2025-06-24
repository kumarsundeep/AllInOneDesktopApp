import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Set custom cache directory to fix permission issues
const userDataPath = path.join(process.env.APPDATA, 'AllInOneDesktopApp')
const gpuCachePath = path.join(userDataPath, 'GPUCache')

// Create the directories if they don't exist
try {
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true })
  }
  if (!fs.existsSync(gpuCachePath)) {
    fs.mkdirSync(gpuCachePath, { recursive: true })
  }
} catch (err) {
  console.error('Failed to create cache directories:', err)
}

// Set GPU cache directory via command line
process.argv.push(`--gpu-disk-cache-dir=${gpuCachePath}`)

// Now import electron
import electron from 'electron'
const { app, BrowserWindow, ipcMain } = electron

import electronDebug from 'electron-debug'
import electronContextMenu from 'electron-context-menu'
import unhandled from 'electron-unhandled'
import electronUpdater from 'electron-updater'
const { autoUpdater } = electronUpdater

import Store from 'electron-store'
import { Worker } from 'worker_threads'
import { createMenu } from './menu.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Set user data path
app.setPath('userData', userDataPath)
console.log('Set user data directory to:', userDataPath)
console.log('Set GPU cache directory to:', gpuCachePath)

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
  // Create loading window immediately
  const loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })
  await loadingWindow.loadFile(path.join(__dirname, 'loading.html'))

  // Create main window in background
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

  // When main window is ready, close loading window and show main window
  mainWindow.once('ready-to-show', () => {
    // Add a short delay to ensure loading window has time to display
    setTimeout(() => {
      loadingWindow.close()
      mainWindow.show()
      if (process.env.NODE_ENV === 'production') {
        autoUpdater.checkForUpdatesAndNotify()
      }
    }, 500)
  })

  // Start memory worker
  const memoryWorker = new Worker(path.join(__dirname, 'memoryWorker.js'))
  memoryWorker.on('message', (memoryUsage) => {
    if (mainWindow) {
      mainWindow.webContents.send('memory-usage', memoryUsage)
    }
  })
}

// Theme management
ipcMain.handle('getTheme', () => {
  return store.get('theme', 'light')
})

ipcMain.on('setTheme', (event, theme) => {
  store.set('theme', theme)
  mainWindow.webContents.send('theme-changed', theme)
})

// Language preference handling
ipcMain.handle('getLanguage', () => {
  return store.get('language', 'en')
})

ipcMain.on('language-changed', (event, language) => {
  store.set('language', language)
  reloadTranslations(language)

  // Notify all windows about language change
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((window) => {
    window.webContents.send('language-changed', language)
  })
})

// Error reporting IPC handler
ipcMain.on('error-report', (event, reportData) => {
  console.error('Error report received:', reportData)
  // TODO: Implement backend service integration
  // sendToBackendService(reportData)
})

// Reload translations for new language
function reloadTranslations(lang) {
  try {
    const localePath = path.join(__dirname, 'locales', `${lang}.json`)
    const rawData = fs.readFileSync(localePath)
    const translations = JSON.parse(rawData)
    // TODO: Implement actual translation reloading logic
    console.log(`Loaded ${Object.keys(translations).length} translations for ${lang}`)
  } catch (err) {
    console.error('Failed to reload translations:', err)
  }
}

// Create error reporting window
function createErrorWindow() {
  const errorWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })
  errorWindow.loadFile(path.join(__dirname, 'error-reporting.html'))
}

// App lifecycle
app.on('ready', () => {
  createWindow()
  createMenu(mainWindow)
})

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
