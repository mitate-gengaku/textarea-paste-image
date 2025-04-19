import { defineConfig } from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths"
import react from '@vitejs/plugin-react';
import path from 'path'

export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  resolve: {
    alias: {
      '@/src/': path.resolve(__dirname),
    }
  },
  test: {
    coverage: {
      include: [
        "src"
      ]
    },
    environment: "happy-dom",
    globals: true,
    include: [
      '**/*.test.?(c|m)[jt]s?(x)'
    ],
    setupFiles: "./src/tests/setup/setup.ts"
  },
})
