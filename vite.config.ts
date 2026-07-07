import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  root: 'src/renderer',
  build: {
    outDir: '../../out/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/index.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@main': resolve(__dirname, 'src/main'),
      '@preload': resolve(__dirname, 'src/preload'),
      '@shared': resolve(__dirname, 'src/shared')
    }
  }
})
