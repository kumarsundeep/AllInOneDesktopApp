import Store from 'electron-store'

// Simple configuration without advanced error handling
export default new Store({
  defaults: {
    fallbackErr: '',
  },
})
