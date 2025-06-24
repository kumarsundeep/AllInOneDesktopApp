const { ipcRenderer } = require('electron')

let currentLanguage = 'en'
let translations = {}

// Load translations for error messages
async function loadTranslations(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`)
    translations = await response.json()
    currentLanguage = lang
    console.log(`Error reporter translations loaded for ${lang}`)
  } catch (err) {
    console.error('Failed to load error reporter translations:', err)
  }
}

// Initialize translations
loadTranslations(currentLanguage)

// Listen for language changes
ipcRenderer.on('language-changed', (event, language) => {
  loadTranslations(language)
})

/**
 * Captures error details and triggers UI notification
 * @param {Error} error - The error object to capture
 */
function captureError(error) {
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  }

  // Translate error message using translationKey if available
  if (error.translationKey && translations[error.translationKey]) {
    errorDetails.translatedMessage = translations[error.translationKey]
  } else if (translations[error.message]) {
    errorDetails.translatedMessage = translations[error.message]
  }

  // Trigger UI notification (to be implemented in error-reporting.html)
  window.dispatchEvent(new CustomEvent('error-captured', { detail: errorDetails }))

  // Send to main process for further handling
  sendReport(errorDetails)
}

/**
 * Sends error report to backend service via main process
 * @param {Object} reportData - Error report data
 */
function sendReport(reportData) {
  if (window.electronAPI) {
    window.electronAPI.sendErrorReport(reportData)
  } else {
    console.error('Electron API not available for error reporting')
  }
}

module.exports = { captureError, sendReport }
