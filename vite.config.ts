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
      },
    },
  },
})
