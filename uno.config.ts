import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  content: {
    // Scan source files directly so dev startup includes every Vue component.
    filesystem: ['src/**/*.{vue,ts}', 'index.html'],
  },
  theme: {
    colors: {
      brand: {
        50: '#f0fdf6',
        100: '#dbfbe9',
        200: '#b8f6d3',
        300: '#7eecb2',
        400: '#3cd88b',
        500: '#2da86c', // LX classic fresh green
        600: '#238957',
        700: '#1e6d47',
        800: '#1b563a',
        900: '#174731',
      },
    },
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
    'text-theme': 'text-brand-500 dark:text-brand-400',
    'bg-theme': 'bg-brand-500 dark:bg-brand-600',
    'desktop-card': 'bg-white dark:bg-[#18181c] border border-zinc-200/70 dark:border-zinc-800/70 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]',
    'desktop-btn': 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none inline-flex items-center justify-center gap-1.5',
    'desktop-btn-primary': 'desktop-btn bg-brand-500 hover:bg-brand-600 text-white font-medium shadow-sm',
    'desktop-btn-secondary': 'desktop-btn bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60',
  },
})
