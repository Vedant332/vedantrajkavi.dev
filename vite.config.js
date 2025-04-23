
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/vedantrajkavi.dev/',  // 👈 this is the key part
  plugins: [react()],
})