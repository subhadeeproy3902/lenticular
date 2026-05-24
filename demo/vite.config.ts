import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  resolve: {
    alias: {
      'lenticular-fx': resolve(__dirname, '../src/index.ts'),
      // Force a single copy of react / react-dom — without this, both the
      // demo's node_modules and the parent's resolve, which trips
      // "Invalid hook call" the moment a hook fires.
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
  },
  build: {
    outDir: resolve(__dirname, '../dist-demo'),
    emptyOutDir: true,
  },
})
