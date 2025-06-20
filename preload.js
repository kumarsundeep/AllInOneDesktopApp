const { contextBridge, ipcRenderer } = require('electron')

// Expose minimal safe API to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Minimal API if needed for other features
})

// Directly handle header text updates
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
