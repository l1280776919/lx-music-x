import { Buffer } from 'buffer'

// Ensure Buffer and global are available immediately in browser/Tauri webview
if (typeof window !== 'undefined') {
  ;(window as any).Buffer = Buffer
  ;(window as any).global = window
}
if (typeof globalThis !== 'undefined') {
  ;(globalThis as any).Buffer = Buffer
  ;(globalThis as any).global = globalThis
}

export { Buffer }
