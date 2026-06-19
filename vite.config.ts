import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the repo name so assets resolve under the Pages subpath:
// https://jungwoos.github.io/jihoplan/
export default defineConfig({
  base: '/jihoplan/',
  plugins: [react()],
})
