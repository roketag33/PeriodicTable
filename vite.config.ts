import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    fs: {
      // Permettre à Vite de servir des fichiers en dehors de la racine
      allow: ['..'],
    },
  },
  // Définir le répertoire de sortie
  build: {
    outDir: 'dist',
  },
  // Configuration des assets
  assetsInclude: ['**/*.json'],
}) 