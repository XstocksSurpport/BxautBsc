import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub Pages: set `VITE_BASE_PATH=/repository-name/` in CI or `.env`. */
const base = (process.env.VITE_BASE_PATH || "/").replace(/\/?$/, "/");

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
  },
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
