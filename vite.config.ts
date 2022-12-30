import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { name, version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_NAME__: JSON.stringify(name),
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:3030',
        ws: true,
      },
      '/config.json': {
        target: 'http://localhost:3030',
      },
      '/model': {
        target: 'http://localhost:3030',
      },
      '/load': {
        target: 'http://localhost:3030',
      },
      '/reload': {
        target: 'http://localhost:3030',
      },
    },
  },
  plugins: [react()],
});
