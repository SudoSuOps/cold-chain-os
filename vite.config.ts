import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        compute: resolve(__dirname, 'compute/index.html'),
        datasets: resolve(__dirname, 'datasets/index.html'),
        brand: resolve(__dirname, 'brand/index.html'),
        why: resolve(__dirname, 'why/index.html'),
        'last-mile': resolve(__dirname, 'last-mile/index.html'),
        'new-era': resolve(__dirname, 'new-era/index.html'),
        'deal-room': resolve(__dirname, 'deal-room/index.html'),
      },
    },
  },
})
