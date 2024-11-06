import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default {
  build: {
    outDir: 'build', // Ensure it's 'build' or update Netlify's config to match 'dist'
  },
}
