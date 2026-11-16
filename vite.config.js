import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Three.js scenes are lazy-loaded (React.lazy) so they land in their own chunks.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1400,
  },
})
