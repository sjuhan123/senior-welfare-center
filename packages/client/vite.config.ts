import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
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
  base: 'https://www.xn--zb0bt8fd6lsrkqxc.com/',
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
    port: 3100,
  },
});
