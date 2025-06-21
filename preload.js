const { contextBridge, ipcRenderer } = require('electron')

// Expose theme API to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  getTheme: () => ipcRenderer.invoke('get-theme'),
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
})

// Directly handle header text updates and memory usage
ipcRenderer.on('set-header-text', (event, text) => {
  try {
    const headerTextElement = document.querySelector('header p')
    if (headerTextElement) {
      headerTextElement.textContent = text
    } else {
      console.warn('Header text element not found')
    }
  } catch (err) {
    console.error('Error updating header text:', err)
  }
})
