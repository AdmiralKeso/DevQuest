import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Requests to /api go to the local API server (server/index.js).
  const api = { target: `http://localhost:${env.API_PORT || 3001}` }

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy: { '/api': api } },
    preview: { proxy: { '/api': api } },
  }
})
