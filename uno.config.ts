import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  content: {
    // Scan source files directly so dev startup includes every Vue component.
    filesystem: ['src/**/*.{vue,ts}', 'index.html'],
  },
  theme: {
    colors: {
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8', // Pure crystal sky blue (no green/murky tint)
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
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
    'text-theme': 'text-brand-400',
    'bg-theme': 'bg-brand-500',
    'glass-panel': 'bg-[#121316]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    'glass-card': 'bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-md border border-white/[0.08] transition-all rounded-xl',
    'glass-input': 'bg-black/30 backdrop-blur-md border border-white/10 focus:border-sky-500/50 text-zinc-100 placeholder-zinc-500 outline-none',
    'desktop-card': 'bg-[#141518]/80 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-lg',
    'desktop-btn': 'px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none inline-flex items-center justify-center gap-1.5 cursor-pointer',
    'desktop-btn-primary': 'desktop-btn bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/15 shadow-sm backdrop-blur-md',
    'desktop-btn-secondary': 'desktop-btn bg-white/[0.05] hover:bg-white/[0.09] text-zinc-300 border border-white/[0.08] backdrop-blur-sm',
    'desktop-btn-accent': 'desktop-btn bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-sm shadow-sky-500/25',
  },
})
