import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  assetsInclude: ['**/*.jpg'],
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    svgr(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: './index.html',
        nested: './sw.js',
      },
    },
  },
  server: {
    port: 433,
  },
});
