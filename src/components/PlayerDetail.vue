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
      class="fixed top-8 inset-x-0 bottom-[68px] z-40 flex flex-col bg-[#121214] text-white overflow-hidden select-none"
    >
      <!-- 动态背景氛围毛玻璃光晕 -->
      <div
        class="absolute inset-0 bg-cover bg-center blur-3xl opacity-35 scale-125 pointer-events-none transition-all duration-1000"
        :style="{ backgroundImage: `url(${playerStore.currentMusic?.pic || defaultCover})` }"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-[#121214]/70 to-[#121214] pointer-events-none"></div>

      <!-- 顶部控制条 -->
      <header class="relative z-10 h-12 flex items-center justify-between px-5 border-b border-white/10 backdrop-blur-md flex-shrink-0">
        <!-- 明显的返回/收起按钮 -->
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium cursor-pointer"
          title="收起播放详情 (Esc)"
          @click="playerStore.isDetailOpen = false"
        >
          <ChevronDown class="w-4 h-4" />
          <span>收起详情</span>
        </button>

        <div class="text-center truncate px-4">
          <div class="font-bold text-xs tracking-wide truncate">{{ playerStore.currentMusic?.name }}</div>
          <div class="text-[11px] text-white/60 truncate mt-0.5">
            {{ playerStore.currentMusic?.singer }}
            <span v-if="playerStore.currentMusic?.album"> · {{ playerStore.currentMusic.album }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="w-7 h-7 rounded-md flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors text-xs"
            title="音效均衡器"
            @click="playerStore.isSoundEffectOpen = true"
          >
            <Sliders class="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <!-- 主体区域: 左侧黑胶大封面 + 右侧沉浸式逐行歌词 -->
      <div class="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 px-12 py-8 overflow-hidden">
        <!-- 左侧: 现代黑胶唱片封面 -->
        <div class="flex flex-col items-center justify-center space-y-6">
          <div class="relative group">
            <!-- 唱片黑胶外圈 -->
            <div
              class="w-72 h-72 md:w-80 md:h-80 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center relative p-3 transition-transform duration-700"
              :class="playerStore.isPlaying ? 'animate-spin-slow' : ''"
            >
              <!-- 黑胶同心纹路 -->
              <div class="absolute inset-2 rounded-full border border-white/5 pointer-events-none"></div>
              <div class="absolute inset-5 rounded-full border border-white/5 pointer-events-none"></div>
              <div class="absolute inset-8 rounded-full border border-white/5 pointer-events-none"></div>

              <!-- 中心封面图 -->
              <img
                :src="playerStore.currentMusic?.pic || defaultCover"
                alt="cover"
                referrerpolicy="no-referrer"
                class="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-inner pointer-events-none"
                @error="onImgError"
              />

              <!-- 中心小孔轴心 -->
              <div class="absolute w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow-md"></div>
            </div>
          </div>

          <!-- 歌曲快速收藏与操作 -->
          <div class="flex items-center gap-4 text-sm text-white/70">
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition active:scale-95"
              :class="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? 'text-red-400 font-semibold' : ''"
              @click="playerStore.toggleFavorite(playerStore.currentMusic?.id || '')"
            >
              <Heart
                class="w-4 h-4"
                :class="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? 'text-red-500 fill-current' : 'text-white/60'"
              />
              <span>喜欢</span>
            </button>

            <button
              class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xs"
              @click="playerStore.cyclePlayMode()"
            >
              <component :is="playModeComponent" class="w-3.5 h-3.5 text-brand-400" />
              <span>{{ playModeLabel }}</span>
            </button>
          </div>
        </div>

        <!-- 右侧: 交互式平滑滚动歌词 -->
        <div class="flex flex-col h-full overflow-hidden">
          <div
            ref="lyricScrollBox"
            class="flex-1 overflow-y-auto pr-4 space-y-5 scroll-smooth py-32"
          >
            <div v-if="displayLyrics.length === 0" class="py-24 text-center text-white/40 text-sm">
              纯音乐，请欣赏
            </div>
            <div
              v-for="(line, idx) in displayLyrics"
              :key="idx"
              class="transition-all duration-200 cursor-pointer group"
              :class="idx === activeLyricIndex ? 'text-xl md:text-2xl font-semibold text-white' : 'text-sm md:text-base text-white/40 hover:text-white/80'"
              @click="seekToLine(line.time)"
            >
              <div class="flex items-center gap-2.5">
                <span class="opacity-0 group-hover:opacity-100 text-[11px] text-brand-400 font-mono transition-opacity flex items-center gap-1">
                  <Play class="w-3 h-3 fill-current" />
                  <span>{{ formatTime(line.time) }}</span>
                </span>
                <span>{{ line.text }}</span>
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
import { backendState } from '@/core/backend'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2310b981"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

const playerStore = usePlayerStore()
const lyricScrollBox = ref<HTMLElement | null>(null)

const displayLyrics = computed(() => backendState.lyricEntries)
const activeLyricIndex = computed(() => playerStore.currentLineIndex)

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
  animation: spin-slow 25s linear infinite;
}

.mask-fade {
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}
</style>


