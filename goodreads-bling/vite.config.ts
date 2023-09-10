import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import bling from '@tanstack/bling/vite';
import ssr from 'vite-plugin-ssr/plugin';

export default defineConfig({
  plugins: [bling(), react()],
  resolve: {
    alias: [{ find: '~', replacement: path.resolve(__dirname, 'src') }],
  },
});
