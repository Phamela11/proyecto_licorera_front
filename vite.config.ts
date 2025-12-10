import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Permite acceso desde cualquier host
    port: 5173, // Puerto por defecto de Vite
    allowedHosts: [
      '8a19e5323481.ngrok-free.app',
      '.ngrok-free.app', // Permite cualquier subdominio de ngrok
      '.ngrok.io', // Permite también dominios .ngrok.io
      'localhost',
      '127.0.0.1'
    ],
    hmr: {
      clientPort: 443, // Puerto para HMR cuando se usa ngrok con HTTPS
    }
  },
})
