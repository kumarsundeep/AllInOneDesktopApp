import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      electron({
        entry: 'index.js',
      }),
      renderer(),
    ],
    build: {
      sourcemap: !isProduction,
      minify: isProduction,
      cacheDir: './.vite_cache',
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
        maxParallelFileOps: 4,
      },
      commonjsOptions: {
        exclude: [/\/node_modules\/electron-updater\/.*/],
      },
    },
    optimizeDeps: {
      include: ['electron-updater'],
      exclude: ['electron'],
    },
  }
})
