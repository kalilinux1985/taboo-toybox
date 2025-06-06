import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Removed tailwindcss from plugins array
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    base: '/<taboo-toybox>/',
  },
}));
