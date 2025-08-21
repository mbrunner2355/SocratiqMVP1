import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  },
  server: {
    host: '0.0.0.0',  // Allow external connections
    port: 5000,       // Keep current port for compatibility
    allowedHosts: [
      '.replit.dev',  // Allow all replit.dev subdomains
      'localhost'
    ]
  }
})