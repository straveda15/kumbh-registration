import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    // If 5173 is taken, Vite silently falls forward to the next free port
    // (5174, 5175, ...) instead of failing — the dev server's real origin
    // then quietly drifts away from whatever FRONTEND_URL/CORS_ORIGIN the
    // backend .env has configured, causing CORS failures that look like a
    // config bug but are actually a stale port. strictPort makes the
    // mismatch fail loudly at startup instead of silently at request time.
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
