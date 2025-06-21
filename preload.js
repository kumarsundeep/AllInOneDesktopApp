const { contextBridge, ipcRenderer } = require('electron')

// Expose a more generic Electron API to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  getTheme: () => ipcRenderer.invoke('getTheme'),
  setTheme: (theme) => ipcRenderer.send('setTheme', theme),
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
  },
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
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
