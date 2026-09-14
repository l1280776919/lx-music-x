<template>
  <footer class="h-20 w-full px-4 sm:px-6 flex items-center justify-between bg-white/85 dark:bg-zinc-950/85 border-t border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-2xl select-none z-30 transition-colors flex-shrink-0">
    <!-- 左侧: 歌曲封面与信息 (紧凑成组，杜绝大屏漂移) -->
    <div class="flex items-center gap-3 w-[220px] sm:w-[260px] md:w-[280px] flex-shrink-0 min-w-0">
      <div
        class="w-12 h-12 rounded-xl relative overflow-hidden group cursor-pointer shadow-md bg-gradient-to-br from-zinc-800 to-zinc-950 flex-shrink-0 flex items-center justify-center"
        @click="playerStore.isDetailOpen = true"
      >
        <img
          v-if="currentCover"
          :src="currentCover"
          referrerpolicy="no-referrer"
          alt="cover"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="handleImgError"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-900 text-white">
          <Music2 class="w-5 h-5" />
        </div>
        <!-- 展开悬浮遮罩 -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Maximize2 class="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div class="overflow-hidden flex-1 min-w-0 cursor-pointer" @click="playerStore.isDetailOpen = true">
        <div class="flex items-center gap-1.5">
          <div class="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate hover:text-emerald-500 transition-colors">
            {{ playerStore.currentMusic?.name || '等待播放音乐' }}
          </div>
          <!-- 动态跳动音阶微标 -->
          <div v-if="playerStore.isPlaying" class="flex items-end gap-[2px] h-3 flex-shrink-0">
            <span class="w-[2px] h-full bg-emerald-500 rounded-full animate-bounce"></span>
            <span class="w-[2px] h-2/3 bg-emerald-500 rounded-full animate-bounce delay-75"></span>
            <span class="w-[2px] h-4/5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
          </div>
        </div>
        <div class="text-xs text-zinc-400 mt-0.5 truncate hover:text-zinc-300 transition-colors">
          {{ playerStore.currentMusic?.singer || '网罗全网好音乐' }} · {{ playerStore.currentMusic?.album || 'LX Music X' }}
        </div>
      </div>

      <!-- 收藏/喜欢按钮: 紧跟在歌曲名称右侧，无漂移！ -->
      <button
        class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-transform active:scale-90 text-zinc-400 hover:text-rose-500"
        :title="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? '已收藏' : '添加到我喜欢'"
        @click="playerStore.toggleFavorite(playerStore.currentMusic?.id || '')"
      >
        <Heart
          class="w-4 h-4 transition-colors"
          :class="playerStore.isFavorite(playerStore.currentMusic?.id || '')
            ? 'fill-rose-500 text-rose-500 scale-110'
            : 'text-zinc-400 hover:text-rose-500'"
        />
      </button>
    </div>

    <!-- 中间: 播放器核心控制与高精度进度条 (自适应弹性填充，居中对齐) -->
    <div class="flex flex-col items-center justify-center flex-1 max-w-[640px] min-w-0 px-2 sm:px-6">
      <div class="flex items-center gap-2 sm:gap-4 md:gap-6">
        <!-- 播放模式切换 (列表循环/单曲循环/随机播放) -->
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          :title="playModeLabel"
          @click="playerStore.cyclePlayMode()"
        >
          <Shuffle v-if="playerStore.playMode === 'random'" class="w-3.5 h-3.5 text-emerald-500" />
          <Repeat1 v-else-if="playerStore.playMode === 'single'" class="w-3.5 h-3.5 text-emerald-500" />
          <Repeat v-else class="w-3.5 h-3.5" />
        </button>

        <!-- 上一首 -->
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition active:scale-90"
          title="上一首 (Alt + Left)"
          @click="playerStore.playPrev()"
        >
          <SkipBack class="w-4 h-4 fill-current" />
        </button>

        <!-- 播放 / 暂停 主按键 (大圆形现代按键) -->
        <button
          class="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
          :title="playerStore.isPlaying ? '暂停 (空格键)' : '播放 (空格键)'"
          @click="playerStore.togglePlay()"
        >
          <Pause v-if="playerStore.isPlaying" class="w-4 h-4 fill-current" />
          <Play v-else class="w-4 h-4 fill-current ml-0.5" />
        </button>

        <!-- 下一首 -->
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition active:scale-90"
          title="下一首 (Alt + Right)"
          @click="playerStore.playNext()"
        >
          <SkipForward class="w-4 h-4 fill-current" />
        </button>

        <!-- 展开全屏歌词按钮 -->
        <button
          class="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          title="展开沉浸式歌词大屏"
          @click="playerStore.isDetailOpen = true"
        >
          <Maximize2 class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- 时间与高精度平滑进度条 -->
      <div class="w-full flex items-center gap-2 sm:gap-3 text-[11px] text-zinc-400 font-mono mt-1">
        <span class="w-9 text-right tabular-nums text-[10px] sm:text-xs">{{ formatTime(playerStore.currentTime) }}</span>
        <div
          class="flex-1 h-3 flex items-center relative cursor-pointer group"
          @click="handleSeek"
        >
          <!-- 底槽 -->
          <div class="w-full h-1 group-hover:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full transition-all overflow-hidden relative">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-75"
              :style="{ width: `${playerStore.progressPercent}%` }"
            ></div>
          </div>
          <!-- 悬浮滑块圆点 -->
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            :style="{ left: `${playerStore.progressPercent}%` }"
          ></div>
        </div>
        <span class="w-9 tabular-nums text-[10px] sm:text-xs">{{ formatTime(playerStore.duration) }}</span>
      </div>
    </div>

    <!-- 右侧: 辅助功能 (自适应宽度，响应式收缩) -->
    <div class="flex items-center justify-end gap-1.5 sm:gap-2.5 w-[160px] sm:w-[220px] md:w-[260px] flex-shrink-0 min-w-0">
      <!-- 专业 10 段 EQ 音效按键 -->
      <button
        class="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition"
        :class="playerStore.isSoundEffectOpen
          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100'"
        title="开启专业 10 段 EQ 与空间混响"
        @click="playerStore.isSoundEffectOpen = true"
      >
        <Sliders class="w-3.5 h-3.5" />
        <span class="hidden sm:inline text-[11px]">EQ</span>
      </button>

      <!-- 独立桌面悬浮歌词开关 -->
      <button
        class="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition"
        :class="playerStore.isDesktopLyricOpen
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100'"
        title="切换桌面悬浮置顶歌词"
        @click="handleToggleDesktopLyric"
      >
        <Quote class="w-3.5 h-3.5" />
        <span class="hidden md:inline text-[11px]">桌面歌词</span>
      </button>

      <!-- 动态音量调节与静音控制 -->
      <div class="flex items-center gap-1.5 pl-1">
        <button
          class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
          :title="playerStore.isMuted ? '取消静音' : '静音'"
          @click="playerStore.toggleMute()"
        >
          <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-4 h-4 text-rose-400" />
          <Volume1 v-else-if="playerStore.volume < 0.5" class="w-4 h-4" />
          <Volume2 v-else class="w-4 h-4" />
        </button>
        <input
          v-model.number="playerStore.volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-16 sm:w-20 md:w-24 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none accent-emerald-500 cursor-pointer"
          @input="playerStore.setVolume(playerStore.volume)"
        />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/store/player'
import { toggleDesktopLyricWindow } from '@/core/tauriBridge'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Sliders,
  Quote,
  Maximize2,
  Volume2,
  Volume1,
  VolumeX,
  Music2,
} from 'lucide-vue-next'

const playerStore = usePlayerStore()

// 优雅的内置离线矢量黑胶唱片默认封面，彻底杜绝 404 碎图
const fallbackCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%230f766e"/></linearGradient></defs><rect width="300" height="300" rx="36" fill="url(%23g)"/><circle cx="150" cy="150" r="95" fill="%2309090b" opacity="0.9"/><circle cx="150" cy="150" r="75" fill="none" stroke="%2327272a" stroke-width="1.5"/><circle cx="150" cy="150" r="55" fill="none" stroke="%2327272a" stroke-width="1.5"/><circle cx="150" cy="150" r="32" fill="%2310b981"/><circle cx="150" cy="150" r="10" fill="%2309090b"/></svg>'

const currentCover = ref<string>('')

watch(() => playerStore.currentMusic?.pic, (newPic) => {
  currentCover.value = newPic || fallbackCover
}, { immediate: true })

function handleImgError() {
  currentCover.value = fallbackCover
}

function handleToggleDesktopLyric() {
  playerStore.isDesktopLyricOpen = !playerStore.isDesktopLyricOpen
  toggleDesktopLyricWindow(playerStore.isDesktopLyricOpen)
}

function formatTime(secs: number) {
  if (isNaN(secs)) return '00:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function handleSeek(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, clickX / rect.width))
  playerStore.seekTime(ratio * playerStore.duration)
}

const playModeLabel = computed(() => {
  switch (playerStore.playMode) {
    case 'single': return '单曲循环'
    case 'random': return '随机播放'
    default: return '列表循环'
  }
})
</script>
