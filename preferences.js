// Load saved preferences
window.electronAPI.invoke('get-preferences').then((prefs) => {
  if (prefs.theme) document.getElementById('theme').value = prefs.theme
  if (prefs.autoUpdate) document.getElementById('autoupdate').value = prefs.autoUpdate
  if (prefs.language) document.getElementById('language').value = prefs.language
})

document.getElementById('save-btn').addEventListener('click', () => {
  const preferences = {
    theme: document.getElementById('theme').value,
    autoUpdate: document.getElementById('autoupdate').value,
    language: document.getElementById('language').value,
  }
  window.electronAPI.send('save-preferences', preferences)

  // Notify theme change
  window.electronAPI.send('theme-changed', preferences.theme)
  window.electronAPI.send('language-changed', preferences.language)
  window.close()
})

document.getElementById('cancel-btn').addEventListener('click', () => {
  window.close()
})
