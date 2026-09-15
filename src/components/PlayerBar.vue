<template>
  <footer class="h-[68px] w-full px-4 flex items-center justify-between bg-white dark:bg-[#161619] border-t border-zinc-200/80 dark:border-zinc-800/80 select-none z-50 transition-colors flex-shrink-0">
    <!-- 左侧: 歌曲封面与信息 -->
    <div class="flex items-center gap-3 w-[240px] flex-shrink-0 min-w-0">
      <div
        class="w-11 h-11 rounded-lg relative overflow-hidden group cursor-pointer bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center border border-zinc-200/60 dark:border-zinc-700/60"
        :title="playerStore.isDetailOpen ? '收起详情 (Esc)' : '展开歌词大屏'"
        @click="playerStore.isDetailOpen = !playerStore.isDetailOpen"
      >
        <img
          v-if="currentCover"
          :src="currentCover"
          referrerpolicy="no-referrer"
          alt="cover"
          class="w-full h-full object-cover"
          @error="handleImgError"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
          <Music2 class="w-5 h-5" />
        </div>
        <!-- 展开/收起遮罩 -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <ChevronDown v-if="playerStore.isDetailOpen" class="w-4 h-4 text-white" />
          <Maximize2 v-else class="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div class="overflow-hidden flex-1 min-w-0">
        <div
          class="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate cursor-pointer hover:text-brand-500 transition-colors"
          :title="playerStore.isDetailOpen ? '收起详情 (Esc)' : '展开歌词大屏'"
          @click="playerStore.isDetailOpen = !playerStore.isDetailOpen"
        >
          {{ playerStore.currentMusic?.name || '洛雪音乐' }}
        </div>
        <div class="text-[11px] text-zinc-400 mt-0.5 truncate">
          {{ playerStore.currentMusic?.singer || '无播放歌曲' }}
          <span v-if="playerStore.currentMusic?.album"> · {{ playerStore.currentMusic.album }}</span>
        </div>
      </div>

      <!-- 收藏按钮 -->
      <button
        class="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-colors"
        :title="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? '取消喜欢' : '喜欢'"
        @click="playerStore.toggleFavorite(playerStore.currentMusic?.id || '')"
      >
        <Heart
          class="w-4 h-4 transition-colors"
          :class="playerStore.isFavorite(playerStore.currentMusic?.id || '')
            ? 'fill-rose-500 text-rose-500'
            : 'text-zinc-400 hover:text-rose-500'"
        />
      </button>
    </div>

    <!-- 中间: 核心控制与进度条 -->
    <div class="flex flex-col items-center justify-center flex-1 max-w-[560px] min-w-0 px-4">
      <!-- 控制按键组 -->
      <div class="flex items-center gap-4">
        <!-- 播放模式切换 -->
        <button
          class="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          :title="playModeLabel"
          @click="playerStore.cyclePlayMode()"
        >
          <Shuffle v-if="playerStore.playMode === 'random'" class="w-3.5 h-3.5 text-brand-500" />
          <Repeat1 v-else-if="playerStore.playMode === 'single'" class="w-3.5 h-3.5 text-brand-500" />
          <Repeat v-else class="w-3.5 h-3.5" />
        </button>

        <!-- 上一首 -->
        <button
          class="w-7 h-7 rounded-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title="上一首 (Alt + Left)"
          @click="playerStore.playPrev()"
        >
          <SkipBack class="w-4 h-4 fill-current" />
        </button>

        <!-- 播放 / 暂停 -->
        <button
          class="w-8 h-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-sm transition-colors"
          :title="playerStore.isPlaying ? '暂停 (空格键)' : '播放 (空格键)'"
          @click="playerStore.togglePlay()"
        >
          <Pause v-if="playerStore.isPlaying" class="w-3.5 h-3.5 fill-current" />
          <Play v-else class="w-3.5 h-3.5 fill-current ml-0.5" />
        </button>

        <!-- 下一首 -->
        <button
          class="w-7 h-7 rounded-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title="下一首 (Alt + Right)"
          @click="playerStore.playNext()"
        >
          <SkipForward class="w-4 h-4 fill-current" />
        </button>

        <!-- 全屏歌词切换 -->
        <button
          class="w-7 h-7 rounded-md hidden sm:flex items-center justify-center transition-colors"
          :class="playerStore.isDetailOpen ? 'text-brand-500 bg-brand-500/10' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'"
          :title="playerStore.isDetailOpen ? '收起歌词详情 (Esc)' : '歌词大屏'"
          @click="playerStore.isDetailOpen = !playerStore.isDetailOpen"
        >
          <ChevronDown v-if="playerStore.isDetailOpen" class="w-4 h-4" />
          <Maximize2 v-else class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- 进度条 -->
      <div class="w-full flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-1">
        <span class="w-8 text-right tabular-nums">{{ formatTime(playerStore.currentTime) }}</span>
        <div
          class="flex-1 h-2 flex items-center relative cursor-pointer group"
          @click="handleSeek"
        >
          <div class="w-full h-1 group-hover:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full transition-all overflow-hidden relative">
            <div
              class="h-full bg-brand-500 rounded-full"
              :style="{ width: `${playerStore.progressPercent}%` }"
            ></div>
          </div>
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-sm border border-zinc-300 dark:border-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            :style="{ left: `${playerStore.progressPercent}%` }"
          ></div>
        </div>
        <span class="w-8 tabular-nums">{{ formatTime(playerStore.duration) }}</span>
      </div>
    </div>

    <!-- 右侧: 辅助功能 (音量、EQ、桌面歌词、播放列表) -->
    <div class="flex items-center justify-end gap-2 w-[240px] flex-shrink-0 min-w-0">
      <!-- EQ 均衡器 -->
      <button
        class="p-1.5 rounded-md text-xs font-medium transition-colors"
        :class="playerStore.isSoundEffectOpen
          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'"
        title="均衡器 (EQ)"
        @click="playerStore.isSoundEffectOpen = true"
      >
        <Sliders class="w-4 h-4" />
      </button>

      <!-- 桌面歌词开关 -->
      <button
        class="p-1.5 rounded-md text-xs font-medium transition-colors"
        :class="playerStore.isDesktopLyricOpen
          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'"
        title="桌面歌词"
        @click="handleToggleDesktopLyric"
      >
        <Quote class="w-4 h-4" />
      </button>

      <!-- 播放列表 -->
      <button
        class="p-1.5 rounded-md text-xs font-medium transition-colors relative"
        :class="playerStore.isQueueOpen
          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'"
        title="当前播放列表"
        @click="playerStore.isQueueOpen = !playerStore.isQueueOpen"
      >
        <ListMusic class="w-4 h-4" />
        <span
          v-if="playerStore.playlist.length > 0"
          class="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-brand-500 text-white text-[9px] font-mono flex items-center justify-center leading-none"
        >
          {{ playerStore.playlist.length > 99 ? '99+' : playerStore.playlist.length }}
        </span>
      </button>

      <!-- 音量控制 -->
      <div class="flex items-center gap-1.5 pl-1">
        <button
          class="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
          :title="playerStore.isMuted ? '取消静音' : '静音'"
          @click="playerStore.toggleMute()"
        >
          <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3.5 h-3.5 text-rose-400" />
          <Volume1 v-else-if="playerStore.volume < 0.5" class="w-3.5 h-3.5" />
          <Volume2 v-else class="w-3.5 h-3.5" />
        </button>
        <input
          v-model.number="playerStore.volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-18 h-1 bg-zinc-200 dark:bg-zinc-800 rounded appearance-none accent-[#2da86c] cursor-pointer"
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
  ChevronDown,
  Volume2,
  Volume1,
  VolumeX,
  Music2,
  ListMusic,
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
