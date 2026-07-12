import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'renderer/routes',
      generatedRouteTree: 'renderer/routes/generated/route-tree.gen.ts',
      routeFileIgnorePattern: 'generated',
    }),
    react(),
    electron({
      main: {
        entry: 'main/index.ts',
      },
      preload: {
        input: 'main/preload.ts',
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@main',
        replacement: path.resolve(__dirname, 'main'),
      },
      {
        find: '@renderer',
        replacement: path.resolve(__dirname, 'renderer'),
      },
      {
        find: '@shared',
        replacement: path.resolve(__dirname, 'shared'),
      },
    ],
  },
})
