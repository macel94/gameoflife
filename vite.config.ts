import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Use relative paths for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
