import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import electron from 'electron'

import electronUpdater from 'electron-updater'
import electronUtil from 'electron-util'
import unhandled from 'electron-unhandled'
import debug from 'electron-debug'
import contextMenu from 'electron-context-menu'
import config from './config.js'
import menu from './menu.js'

const { app, BrowserWindow, Menu, ipcMain } = electron

// Disable cache to prevent access errors
app.commandLine.appendSwitch('disable-http-cache')
const { autoUpdater } = electronUpdater
const { is } = electronUtil

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

unhandled()
debug()
contextMenu()

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.company.AppName')

// Enable auto-updates with certificate pinning
if (!is.development || process.argv.includes('--test-update')) {
  // Override auto-updater config for testing
  if (process.argv.includes('--test-update')) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
  }
  const FOUR_HOURS = 1000 * 60 * 60 * 4

  // Certificate pinning configuration from environment variables
  autoUpdater.publisherName = process.env.PUBLISHER_NAME
  autoUpdater.verifyUpdateCodeSignature = true

  // Add certificate fingerprints from environment variables
  const pinnedFingerprints = new Set()
  if (process.env.CERTIFICATE_FINGERPRINT_1)
    pinnedFingerprints.add(process.env.CERTIFICATE_FINGERPRINT_1)
  if (process.env.CERTIFICATE_FINGERPRINT_2)
    pinnedFingerprints.add(process.env.CERTIFICATE_FINGERPRINT_2)

  // Verify update signature against pinned fingerprints
  autoUpdater.on(
    'update-downloaded',
    (event, releaseNotes, releaseName, releaseDate, updateURL) => {
      const cert = event.certificates && event.certificates[0]
      if (cert && pinnedFingerprints.has(cert.fingerprint256)) {
        autoUpdater.quitAndInstall()
      } else {
        console.error('Certificate verification failed')
        // Handle invalid certificate (e.g., show error to user)
      }
    },
  )

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, FOUR_HOURS)

  autoUpdater.checkForUpdates()
}

// Prevent window from being garbage collected
let mainWindow

const createMainWindow = async () => {
  const window_ = new BrowserWindow({
    title: app.name,
    show: false,
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  window_.on('ready-to-show', () => {
    window_.show()
  })

  window_.on('closed', () => {
    // Dereference the window
    // For multiple windows store them in an array
    mainWindow = undefined
  })

  try {
    const htmlPath = path.join(__dirname, 'index.html')
    console.log(`Attempting to load HTML file from: ${htmlPath}`)

    // Check if file exists
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`File not found: ${htmlPath}`)
    }

    // Use file:// protocol with loadURL
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`
    console.log(`Loading HTML file using URL: ${fileUrl}`)

    await window_.loadURL(fileUrl)
  } catch (err) {
    console.error('Failed to load index.html:', err)

    // Show detailed error in the window
    const errorPage = `
      <!doctype html>
      <html>
      <head>
        <title>Application Error</title>
      </head>
      <body>
        <h1>Failed to load application</h1>
        <p>Error: ${err.message}</p>
        <pre>${err.stack}</pre>
      </body>
      </html>
    `

    await window_.loadURL(`data:text/html,${encodeURIComponent(errorPage)}`)
  }

  return window_
}

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.show()
  }
})

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow()
  }
})

// Main application initialization
const initApp = async () => {
  await app.whenReady()
  // Set application menu after creating main window
  const appMenu = menu // Ensure menu is built
  Menu.setApplicationMenu(appMenu)
  mainWindow = await createMainWindow()

  // Add IPC handlers for preferences
  ipcMain.handle('get-preferences', () => {
    return {
      theme: config.get('theme', 'system'),
      autoUpdate: config.get('autoUpdate', 'enabled'),
    }
  })

  ipcMain.on('save-preferences', (event, prefs) => {
    config.set('theme', prefs.theme)
    config.set('autoUpdate', prefs.autoUpdate)
  })

  const fallbackErr = config.get('fallbackErr')
  // Sanitize user input by escaping HTML special characters
  const sanitizedText = fallbackErr
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;')

  mainWindow.webContents.send('set-header-text', `Something went wrong! ${sanitizedText}`)
}

initApp().catch((err) => {
  console.error('Failed to initialize application:', err)
  process.exit(1)
})
