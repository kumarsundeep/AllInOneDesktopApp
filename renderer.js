// Initialize i18next
i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        appTitle: 'All In One Desktop App',
        memoryUsage: 'Memory: {{usage}}MB',
      },
    },
  },
})

// Apply translations
document.getElementById('app-title').textContent = i18next.t('appTitle')
document.getElementById('app-title-text').textContent = i18next.t('appTitle')

// Apply theme on load
window.electronAPI.getTheme().then((theme) => {
  document.body.className = theme + '-theme'
})

// Listen for theme changes
window.electronAPI.on('theme-changed', (theme) => {
  document.body.className = theme + '-theme'
})

// Listen for memory usage updates
window.electronAPI.on('memory-usage', (usage) => {
  const memoryElement = document.getElementById('memory-usage')
  if (memoryElement) {
    memoryElement.textContent = i18next.t('memoryUsage', {
      usage: Math.round(usage.heapUsed / 1024 / 1024),
    })
  }
})
