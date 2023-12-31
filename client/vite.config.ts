import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
  },
  base: "https://www.xn--zb0bt8fd6lsrkqxc.com/",
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: "./index.html",
        nested: "./sw.js",
      },
    },
    outDir: "../server/public", // 빌드 결과물의 경로를 설정합니다.
  },
});
