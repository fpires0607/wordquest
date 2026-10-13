import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // relative paths: works from any hosting subfolder
  plugins: [react()],
  test: { environment: 'node' },
})
