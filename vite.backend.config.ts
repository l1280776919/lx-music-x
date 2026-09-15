import { defineConfig } from 'vite'
import path from 'node:path'
const root = import.meta.dirname
export default defineConfig({
  plugins: [{ name: 'backend-http', enforce: 'pre', resolveId(id) {
    if (/^(\.\.\/)+request$/.test(id)) return path.join(root, 'backend/request.ts')
  } }],
  resolve: { alias: [
    { find: '@/core/userApi/sandbox', replacement: path.join(root, 'backend/userApi.ts') },
    { find: '@/utils', replacement: path.join(root, 'backend') },
    { find: '@', replacement: path.join(root, 'src') },
    { find: '@common', replacement: path.join(root, 'src/common') },
    ...['crypto', 'dns', 'zlib'].flatMap(n => [n, `node:${n}`].map(find => ({ find, replacement: path.join(root, `backend/shims/${n}.ts`) }))),
  ] },
  publicDir: false,
  build: { outDir: 'src-tauri/generated', emptyOutDir: false, target: 'es2020', minify: false,
    lib: { entry: 'backend/entry.ts', formats: ['iife'], name: 'LxBackend', fileName: () => 'music.js' },
  },
})
