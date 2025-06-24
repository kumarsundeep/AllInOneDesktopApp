process.env.ELECTRON_RUN_AS_NODE = '1'
process.env.ELECTRON_CACHE = './temp-sessiondata/cache'
process.env.ELECTRON_DATA_PATH = './temp-sessiondata'
import Store from 'electron-store'

// Simple configuration without advanced error handling
export default new Store({
  defaults: {
    fallbackErr: '',
    theme: 'system', // 'light', 'dark', or 'system'
  },
})
