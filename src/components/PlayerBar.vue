<template>
  <footer class="h-20 w-full px-6 flex items-center justify-between bg-white/75 dark:bg-zinc-900/75 border-t border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-2xl select-none z-30 transition-colors">
    <!-- 左侧: 歌曲封面与信息 (点击展开沉浸式全屏歌词) -->
    <div class="flex items-center gap-3.5 w-1/4 min-w-[220px]">
      <div
        class="w-12 h-12 rounded-xl relative overflow-hidden group cursor-pointer shadow-md border border-black/10 dark:border-white/10 flex-shrink-0"
        @click="playerStore.isDetailOpen = true"
      >
        <img
          :src="playerStore.currentMusic?.pic || defaultCover"
          alt="album cover"
          class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <!-- 悬浮展开遮罩提示 -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <span class="text-white text-xs">⤢</span>
        </div>
      </div>

      <div class="overflow-hidden flex-1 cursor-pointer" @click="playerStore.isDetailOpen = true">
        <div class="flex items-center gap-2">
          <div class="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate hover:text-emerald-500 transition">
            {{ playerStore.currentMusic?.name || '暂无播放歌曲' }}
          </div>
          <!-- 动态频谱微图标 -->
          <div v-if="playerStore.isPlaying" class="flex items-end gap-[2px] h-3">
            <span class="w-[2px] h-full bg-emerald-500 rounded-full animate-bounce"></span>
            <span class="w-[2px] h-2/3 bg-emerald-500 rounded-full animate-bounce delay-75"></span>
            <span class="w-[2px] h-4/5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
          </div>
        </div>
        <div class="text-xs text-zinc-400 mt-0.5 truncate hover:text-zinc-300 transition">
          {{ playerStore.currentMusic?.singer || '未知歌手' }} · {{ playerStore.currentMusic?.album || '未知专辑' }}
        </div>
      </div>

      <!-- 快速喜欢按钮 -->
      <button
        class="w-8 h-8 rounded-full flex items-center justify-center text-sm transition"
        :class="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? 'text-red-500 scale-110' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'"
        title="喜欢这首歌"
        @click="playerStore.toggleFavorite(playerStore.currentMusic?.id || '')"
      >
        {{ playerStore.isFavorite(playerStore.currentMusic?.id || '') ? '❤️' : '🤍' }}
      </button>
    </div>

    <!-- 中间: 播放器核心控制与滑动进度条 -->
    <div class="flex flex-col items-center gap-1.5 flex-1 max-w-xl px-4">
      <div class="flex items-center gap-6">
        <!-- 播放模式切换 -->
        <button
          class="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition text-sm"
          :title="playModeLabel"
          @click="playerStore.cyclePlayMode()"
        >
          {{ playModeIcon }}
        </button>

        <!-- 上一首 -->
        <button
          class="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition text-lg active:scale-95"
          title="上一首 (Alt + Left)"
          @click="playerStore.playPrev()"
        >
          ⏮
        </button>

        <!-- 播放 / 暂停 主按键 -->
        <button
          class="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition shadow-lg shadow-emerald-500/30 active:scale-90"
          :title="playerStore.isPlaying ? '暂停 (空格键)' : '播放 (空格键)'"
          @click="playerStore.togglePlay()"
        >
          <span class="text-base font-bold ml-[1px]">{{ playerStore.isPlaying ? '⏸' : '▶' }}</span>
        </button>

        <!-- 下一首 -->
        <button
          class="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition text-lg active:scale-95"
          title="下一首 (Alt + Right)"
          @click="playerStore.playNext()"
        >
          ⏭
        </button>

        <!-- 打开全屏歌词按钮 -->
        <button
          class="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition text-sm"
          title="展开沉浸式大屏歌词"
          @click="playerStore.isDetailOpen = true"
        >
          📖
        </button>
      </div>

      <!-- 时间与高精度进度条 -->
      <div class="w-full flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
        <span class="w-10 text-right">{{ formatTime(playerStore.currentTime) }}</span>
        <div
          class="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full relative cursor-pointer group py-1"
          @click="handleSeek"
        >
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-100"
              :style="{ width: `${playerStore.progressPercent}%` }"
            ></div>
          </div>
          <!-- 悬浮滑块圆点 -->
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition pointer-events-none"
            :style="{ left: `${playerStore.progressPercent}%` }"
          ></div>
        </div>
        <span class="w-10">{{ formatTime(playerStore.duration) }}</span>
      </div>
    </div>

    <!-- 右侧: 辅助功能 (10段EQ、桌面悬浮歌词开关、音量调节) -->
    <div class="flex items-center justify-end gap-3.5 w-1/4 min-w-[220px]">
      <!-- 专业 10 段 EQ 音效按键 -->
      <button
        class="px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 transition"
        title="开启专业 10 段 EQ 与空间混响"
        @click="playerStore.isSoundEffectOpen = true"
      >
        EQ
      </button>

      <!-- 独立桌面悬浮歌词开关 -->
      <button
        class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition"
        :class="playerStore.isDesktopLyricOpen
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-sm'
          : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'"
        title="切换桌面悬浮置顶歌词"
        @click="handleToggleDesktopLyric"
      >
        词
      </button>

      <!-- 动态音量调节与静音控制 -->
      <div class="flex items-center gap-2">
        <button
          class="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
          :title="playerStore.isMuted ? '取消静音' : '静音'"
          @click="playerStore.toggleMute()"
        >
          {{ playerStore.isMuted || playerStore.volume === 0 ? '🔇' : playerStore.volume < 0.5 ? '🔉' : '🔊' }}
        </button>
        <input
          v-model.number="playerStore.volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-20 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none accent-emerald-500 cursor-pointer"
          @input="playerStore.setVolume(playerStore.volume)"
        />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/store/player'
import { toggleDesktopLyricWindow } from '@/core/tauriBridge'

const playerStore = usePlayerStore()
const defaultCover = 'https://p2.music.126.net/H7z8x1pC94_e1JzS6o0w4w==/109951165647004069.jpg'

function handleToggleDesktopLyric() {
  playerStore.isDesktopLyricOpen = !playerStore.isDesktopLyricOpen
  toggleDesktopLyricWindow(playerStore.isDesktopLyricOpen)
}

function formatTime(secs: number) {
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

const playModeIcon = computed(() => {
  switch (playerStore.playMode) {
    case 'single': return '🔂'
    case 'random': return '🔀'
    default: return '🔁'
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
