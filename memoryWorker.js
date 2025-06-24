// This runs in a separate thread to monitor memory usage
// and send updates to the main process

import { parentPort } from 'worker_threads'

// Track memory usage at intervals
setInterval(() => {
  const memoryUsage = process.memoryUsage()
  parentPort.postMessage(memoryUsage)
}, 5000)
