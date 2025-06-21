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
    memoryElement.textContent = `Memory: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`
  }
})

// Lazy load non-critical components after initial render
window.addEventListener('DOMContentLoaded', () => {
  // Load non-critical components after 1 second
  setTimeout(() => {
    loadNonCriticalComponents().catch(console.error)
  }, 1000)
})

async function loadNonCriticalComponents() {
  // Placeholder for lazy-loaded components
  // Example: const analytics = await import('./components/Analytics.js')
  console.log('Lazy loading non-critical components')

  // Here we would initialize any lazy-loaded components
  // For now, this is just a placeholder for future functionality
}
