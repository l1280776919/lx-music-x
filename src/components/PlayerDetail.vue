<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-250 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-full"
  >
    <div
      v-if="playerStore.isDetailOpen"
      class="fixed top-12 inset-x-0 bottom-[74px] z-40 flex flex-col bg-[#0c0d10]/95 backdrop-blur-3xl text-white overflow-hidden select-none"
    >
      <!-- 动态背景氛围毛玻璃光晕 (超大模糊与多层色彩融合) -->
      <div
        class="absolute inset-0 bg-cover bg-center blur-[100px] opacity-20 scale-150 pointer-events-none transition-all duration-1000"
        :style="{ backgroundImage: `url(${playerStore.currentMusic?.pic || defaultCover})` }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-[#0e0f13]/80 via-[#0a0b0e]/90 to-[#08090b] pointer-events-none"></div>

      <!-- 顶部控制条 (纯净磨砂玻璃) -->
      <header class="relative z-10 h-12 flex items-center justify-between px-6 border-b border-white/[0.06] backdrop-blur-md flex-shrink-0">
        <!-- 明显的返回/收起按钮 -->
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all text-xs font-medium cursor-pointer shadow-sm"
          title="收起播放详情 (Esc)"
          @click="playerStore.isDetailOpen = false"
        >
          <ChevronDown class="w-4 h-4" />
          <span>收起界面</span>
        </button>

        <div class="text-center truncate px-4 max-w-md">
          <div class="font-bold text-sm tracking-wide truncate text-zinc-100">{{ playerStore.currentMusic?.name }}</div>
          <div class="text-xs text-zinc-400 truncate mt-0.5">
            {{ playerStore.currentMusic?.singer }}
            <span v-if="playerStore.currentMusic?.album"> · {{ playerStore.currentMusic.album }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- 双语翻译歌词开关 -->
          <button
            class="px-2.5 py-1 rounded-full flex items-center justify-center border text-xs font-medium transition-all cursor-pointer select-none"
            :class="[
              !hasTranslation ? 'opacity-40 cursor-not-allowed border-white/5 text-zinc-500' :
              themeStore.showTranslation
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-zinc-400 hover:text-white'
            ]"
            :title="hasTranslation ? (themeStore.showTranslation ? '点击隐藏歌词翻译' : '点击开启双语歌词') : '当前歌曲暂无翻译歌词'"
            :disabled="!hasTranslation"
            @click="hasTranslation && themeStore.toggleTranslation()"
          >
            <span>译</span>
          </button>

          <button
            class="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors text-xs cursor-pointer"
            title="音效均衡器"
            @click="playerStore.isSoundEffectOpen = true"
          >
            <Sliders class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- 主体区域: 左侧黑胶唱片 + 唱针，右侧逐行歌词 -->
      <div class="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 px-8 md:px-14 py-4 overflow-hidden">
        <!-- 左侧: 现代黑胶唱片 + 唱针 -->
        <div class="flex flex-col items-center justify-center relative min-h-[380px]">
          <!-- 唱针支架与唱针 -->
          <div class="absolute -top-4 z-30 pointer-events-none flex flex-col items-center">
            <!-- 唱针轴心小圆盖 -->
            <div class="w-7 h-7 rounded-full bg-zinc-400 border-2 border-zinc-600 shadow-md flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
            </div>
            <!-- 唱针杆臂与磁头 (无突兀红边，采用极光青/银白磁头) -->
            <div
              class="w-24 h-44 -mt-2 transition-transform duration-500 origin-[16px_0px]"
              :class="playerStore.isPlaying ? 'rotate-[0deg]' : '-rotate-[36deg]'"
            >
              <svg viewBox="0 0 100 180" class="w-full h-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.6)]">
                <!-- 针杆 -->
                <path d="M16 10 L30 85 L22 145" fill="none" stroke="#d4d4d8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 145 L22 170" fill="none" stroke="#a1a1aa" stroke-width="6" stroke-linecap="round" />
                <!-- 唱头 (纯净星空蓝与铬银磁头) -->
                <rect x="15" y="160" width="14" height="15" rx="2" fill="#18181b" stroke="#38bdf8" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <!-- 黑胶唱片本体 -->
          <div class="relative group mt-6">
            <!-- 唱片黑胶外圈与同心螺旋纹路 -->
            <div
              class="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 flex items-center justify-center relative overflow-hidden"
              :class="playerStore.isPlaying ? 'animate-spin-slow' : ''"
            >
              <!-- 黑胶微反光同心环 -->
              <div class="absolute inset-0 rounded-full border border-white/[0.04] m-4 pointer-events-none"></div>
              <div class="absolute inset-0 rounded-full border border-white/[0.04] m-10 pointer-events-none"></div>
              <div class="absolute inset-0 rounded-full border border-white/[0.04] m-16 pointer-events-none"></div>
              <div class="absolute inset-0 rounded-full border border-white/[0.04] m-22 pointer-events-none"></div>

              <!-- 中心封面圆盘 -->
              <div class="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/10 shadow-inner bg-zinc-800">
                <img
                  :src="playerStore.currentMusic?.pic || defaultCover"
                  alt="cover"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- 黑胶唱片中心小圆孔 -->
              <div class="absolute w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow-md"></div>
            </div>
          </div>

          <!-- 唱片下方快捷操作（喜欢、播放模式） -->
          <div class="flex items-center gap-4 text-xs text-zinc-300 mt-6">
            <button
              class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
              :class="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? 'text-rose-400 font-semibold' : ''"
              @click="playerStore.toggleFavorite(playerStore.currentMusic?.id || '')"
            >
              <Heart
                class="w-4 h-4"
                :class="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? 'text-rose-400 fill-current' : 'text-zinc-400'"
              />
              <span>{{ playerStore.isFavorite(playerStore.currentMusic?.id || '') ? '已喜欢' : '喜欢' }}</span>
            </button>

            <button
              class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer backdrop-blur-sm"
              @click="playerStore.cyclePlayMode()"
            >
              <component :is="playModeComponent" class="w-4 h-4 text-sky-400" />
              <span>{{ playModeLabel }}</span>
            </button>
          </div>

          <!-- 音频律动频谱 Canvas 与控制按钮 -->
          <div class="w-full max-w-[340px] flex flex-col items-center gap-2 mt-4">
            <div class="w-full h-16 relative flex items-center justify-center">
              <canvas
                ref="visualizerCanvas"
                width="340"
                height="64"
                class="w-full h-full pointer-events-none transition-opacity duration-300"
                :class="visualizerMode === 'off' ? 'opacity-0' : 'opacity-90'"
              ></canvas>
            </div>

            <!-- 频谱模式切换按钮 -->
            <div class="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 text-[11px]">
              <button
                class="px-2.5 py-0.5 rounded-full transition cursor-pointer"
                :class="visualizerMode === 'bars' ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-400/30' : 'text-zinc-400 hover:text-white'"
                @click="setVisualizerMode('bars')"
              >
                柱状频谱
              </button>
              <button
                class="px-2.5 py-0.5 rounded-full transition cursor-pointer"
                :class="visualizerMode === 'wave' ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-400/30' : 'text-zinc-400 hover:text-white'"
                @click="setVisualizerMode('wave')"
              >
                流光声波
              </button>
              <button
                class="px-2.5 py-0.5 rounded-full transition cursor-pointer"
                :class="visualizerMode === 'off' ? 'bg-white/10 text-zinc-200 font-semibold' : 'text-zinc-500 hover:text-zinc-300'"
                @click="setVisualizerMode('off')"
              >
                关闭
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧: 经典居中歌词瀑布 (上下渐变虚化消失 + 纯白微光高亮放大) -->
        <div class="flex flex-col h-full overflow-hidden">
          <div
            ref="lyricScrollBox"
            class="flex-1 overflow-y-auto pr-4 space-y-6 scroll-smooth py-40 mask-lyric-fade"
          >
            <div v-if="displayLyrics.length === 0" class="py-32 text-center text-zinc-500 text-sm">
              纯音乐，请欣赏
            </div>
            <div
              v-for="(line, idx) in displayLyrics"
              :key="idx"
              class="transition-all duration-300 cursor-pointer group text-center"
              :class="idx === activeLyricIndex
                ? 'text-xl md:text-2xl font-bold text-white scale-105 origin-center drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                : 'text-sm md:text-base text-zinc-500 hover:text-zinc-300'"
              @click="seekToLine(line.time)"
            >
              <div class="inline-flex flex-col items-center relative">
                <div class="inline-flex items-center gap-2 relative">
                  <span class="opacity-0 group-hover:opacity-100 text-[10px] text-sky-400 font-mono transition-opacity absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    <Play class="w-2.5 h-2.5 fill-current" />
                    <span>{{ formatTime(line.time) }}</span>
                  </span>
                  <span>{{ line.text }}</span>
                </div>
                <!-- 优雅翻译副歌词 -->
                <div
                  v-if="themeStore.showTranslation && line.trans"
                  class="transition-all duration-300 mt-1.5 font-normal tracking-wide"
                  :class="idx === activeLyricIndex ? 'text-xs md:text-sm text-sky-200/90' : 'text-xs text-zinc-500'"
                >
                  {{ line.trans }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ChevronDown, Sliders, Heart, Repeat, Repeat1, Shuffle, Play } from 'lucide-vue-next'
import { usePlayerStore } from '@/store/player'
import { useThemeStore } from '@/store/theme'
import { backendState } from '@/core/backend'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2310b981"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

const playerStore = usePlayerStore()
const themeStore = useThemeStore()
const lyricScrollBox = ref<HTMLElement | null>(null)

const displayLyrics = computed(() => backendState.lyricEntries)
const activeLyricIndex = computed(() => playerStore.currentLineIndex)
const hasTranslation = computed(() => displayLyrics.value.some(l => !!l.trans))

watch(activeLyricIndex, (newIdx) => {
  if (!playerStore.isDetailOpen || !lyricScrollBox.value) return
  nextTick(() => {
    const children = lyricScrollBox.value?.children
    if (children && children[newIdx]) {
      const el = children[newIdx] as HTMLElement
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
})

function seekToLine(time: number) {
  playerStore.seekTime(time)
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const playModeComponent = computed(() => {
  switch (playerStore.playMode) {
    case 'single': return Repeat1
    case 'random': return Shuffle
    default: return Repeat
  }
})

const playModeLabel = computed(() => {
  switch (playerStore.playMode) {
    case 'single': return '单曲循环'
    case 'random': return '随机播放'
    default: return '列表循环'
  }
})

// 音频律动频谱 Canvas 渲染引擎
const visualizerCanvas = ref<HTMLCanvasElement | null>(null)
const VISUALIZER_KEY = 'lx_visualizer_mode'
const visualizerMode = ref<'bars' | 'wave' | 'off'>(
  (localStorage.getItem(VISUALIZER_KEY) as any) || 'bars'
)

function setVisualizerMode(mode: 'bars' | 'wave' | 'off') {
  visualizerMode.value = mode
  localStorage.setItem(VISUALIZER_KEY, mode)
}

let animFrameId: number | null = null
let waveOffset = 0

function renderVisualizer() {
  if (!playerStore.isDetailOpen) return
  const canvas = visualizerCanvas.value
  if (!canvas) {
    animFrameId = requestAnimationFrame(renderVisualizer)
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  if (visualizerMode.value === 'off') {
    animFrameId = requestAnimationFrame(renderVisualizer)
    return
  }

  const isPlaying = playerStore.isPlaying
  const speed = isPlaying ? 0.08 : 0.02
  waveOffset += speed

  if (visualizerMode.value === 'bars') {
    const numBars = 36
    const barWidth = 5
    const gap = (w - numBars * barWidth) / (numBars - 1)
    const mid = numBars / 2

    for (let i = 0; i < numBars; i++) {
      const distFromCenter = 1 - Math.abs(i - mid) / mid
      const basePulse = isPlaying
        ? Math.sin(waveOffset * 2.5 + i * 0.45) * 0.4 +
          Math.cos(waveOffset * 1.8 + i * 0.25) * 0.3 + 0.35
        : 0.08 + Math.sin(waveOffset + i * 0.2) * 0.04

      const energy = Math.max(0.06, basePulse * distFromCenter)
      const barHeight = Math.min(h - 4, Math.max(4, energy * h * 0.95))
      const x = i * (barWidth + gap)
      const y = (h - barHeight) / 2

      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, '#38bdf8')
      gradient.addColorStop(0.5, '#818cf8')
      gradient.addColorStop(1, '#38bdf8')

      ctx.fillStyle = gradient
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)'
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 2.5)
      ctx.fill()
    }
  } else if (visualizerMode.value === 'wave') {
    ctx.shadowBlur = 10
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)'

    const layers = [
      { color: 'rgba(56, 189, 248, 0.75)', amp: isPlaying ? 16 : 4, freq: 0.025, phase: 0 },
      { color: 'rgba(129, 140, 248, 0.55)', amp: isPlaying ? 12 : 3, freq: 0.035, phase: 2 },
    ]

    for (const l of layers) {
      ctx.beginPath()
      ctx.strokeStyle = l.color
      ctx.lineWidth = 2.5
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * l.freq + waveOffset + l.phase) * l.amp * Math.sin((x / w) * Math.PI)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  animFrameId = requestAnimationFrame(renderVisualizer)
}

watch(() => playerStore.isDetailOpen, (open) => {
  if (open) {
    if (!animFrameId) animFrameId = requestAnimationFrame(renderVisualizer)
  } else {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
  }
}, { immediate: true })
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 22s linear infinite;
}

.animate-spin-pause {
  animation: spin-slow 22s linear infinite;
  animation-play-state: paused;
}

.mask-lyric-fade {
  mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%);
}
</style>


