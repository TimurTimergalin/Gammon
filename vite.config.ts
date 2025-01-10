import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 1026,
    hmr: {
            host: "localhost",
            protocol: "ws",
            port: 1028
        }
  },
  preview: {
    port: 1026
  }
})
