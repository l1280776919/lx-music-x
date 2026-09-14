import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import path from "node:path";
import process from "node:process";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    {
      name: 'ui-boundary',
      enforce: 'pre',
      load(id) {
        if (id.replaceAll('\\', '/').includes('/backend/')) {
          throw new Error(`前端不得引入后端业务模块: ${id}`);
        }
      },
    },
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@common": path.resolve(import.meta.dirname, "./src/common"),
      "crypto": path.resolve(import.meta.dirname, "./src/shims/crypto.ts"),
      "node:crypto": path.resolve(import.meta.dirname, "./src/shims/crypto.ts"),
      "zlib": path.resolve(import.meta.dirname, "./src/shims/zlib.ts"),
      "node:zlib": path.resolve(import.meta.dirname, "./src/shims/zlib.ts"),
      "dns": path.resolve(import.meta.dirname, "./src/shims/dns.ts"),
      "node:dns": path.resolve(import.meta.dirname, "./src/shims/dns.ts"),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
