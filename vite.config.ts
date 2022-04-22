import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:3030',
        ws: true,
      },
    },
  },
  plugins: [react()],
});
