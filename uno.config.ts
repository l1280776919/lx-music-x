import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  content: {
    // Scan source files directly so dev startup includes every Vue component.
    filesystem: ['src/**/*.{vue,ts}', 'index.html'],
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'text-theme': 'text-emerald-500 dark:text-emerald-400',
    'bg-theme': 'bg-emerald-500 dark:bg-emerald-600',
    'glass-panel': 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-lg',
  },
})
