import { captureError } from './utils/errorReporter.js'

// Set up error handlers
window.addEventListener('error', (event) => {
  captureError(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  captureError(event.reason)
})
// Apply theme on load
window.electronAPI.getTheme().then((theme) => {
  document.body.className = theme + '-theme'
})

// Create error simulation button
const errorButton = document.createElement('button')
errorButton.textContent = 'Simulate Error'
errorButton.style.position = 'fixed'
errorButton.style.top = '10px'
errorButton.style.left = '10px'
errorButton.style.zIndex = '1000'
errorButton.style.backgroundColor = 'red'
errorButton.style.color = 'white'
errorButton.style.padding = '10px'
errorButton.addEventListener('click', () => {
  throw new Error('Simulated renderer error for testing purposes')
})
document.body.appendChild(errorButton)
console.log('Simulate Error button created')

// Listen for theme changes
window.electronAPI.on('theme-changed', (theme) => {
  document.body.className = theme + '-theme'
})

// Listen for language changes
window.electronAPI.on('language-changed', (language) => {
  updateUITranslations(language)
})

// Listen for memory usage updates
window.electronAPI.on('memory-usage', (usage) => {
  const memoryElement = document.getElementById('memory-usage')
  if (memoryElement) {
    memoryElement.textContent = `Memory: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`
  }
})

// Update UI translations for new language
async function updateUITranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`)
    const translations = await response.json()

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n')
      if (translations[key]) {
        el.textContent = translations[key]
      }
    })

    console.log(`UI translations updated to ${lang}`)
  } catch (err) {
    console.error('Failed to update translations:', err)
  }
}

// Lazy load non-critical components after initial render
window.addEventListener('DOMContentLoaded', () => {
  // Load non-critical components after 1 second
  setTimeout(() => {
    loadNonCriticalComponents().catch(console.error)
  }, 1000)
})

async function loadNonCriticalComponents() {
  // Lazy-load preferences module
  const { setupPreferences } = await import('./preferences.js')
  setupPreferences()

  console.log('Lazy-loaded non-critical components')
}
