<template>
  <footer class="h-[74px] w-full px-5 flex items-center justify-between bg-[#121316]/85 backdrop-blur-2xl border-t border-white/[0.08] select-none z-50 transition-colors flex-shrink-0">
    <!-- 左侧: 歌曲封面与信息 -->
    <div class="flex items-center gap-3.5 w-[260px] flex-shrink-0 min-w-0">
      <div
        class="w-12 h-12 rounded-xl relative overflow-hidden group cursor-pointer bg-white/[0.05] flex-shrink-0 flex items-center justify-center shadow-lg border border-white/10"
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
        <div v-else class="w-full h-full flex items-center justify-center text-zinc-500">
          <Music2 class="w-5 h-5" />
        </div>
        <!-- 展开/收起遮罩 -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
          <ChevronDown v-if="playerStore.isDetailOpen" class="w-5 h-5 text-white" />
          <Maximize2 v-else class="w-4 h-4 text-white" />
        </div>
      </div>

      <div class="overflow-hidden flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span
            class="font-medium text-xs text-zinc-100 truncate cursor-pointer hover:text-sky-400 transition-colors"
            :title="playerStore.isDetailOpen ? '收起详情 (Esc)' : '展开歌词大屏'"
            @click="playerStore.isDetailOpen = !playerStore.isDetailOpen"
          >
            {{ playerStore.currentMusic?.name || 'LX Music X' }}
          </span>
          <!-- SQ 高清无损音质胶囊标签 (精致银白微磨砂，杜绝墨绿塑料感) -->
          <span
            v-if="playerStore.currentMusic"
            class="px-1.5 py-0.2 rounded bg-white/10 border border-white/20 text-[9px] font-bold text-zinc-200 font-mono scale-90 origin-left flex-shrink-0"
          >
            SQ
          </span>
        </div>
        <div class="text-[11px] text-zinc-400 mt-0.5 truncate">
          {{ playerStore.currentMusic?.singer || '聆听好音乐' }}
          <span v-if="playerStore.currentMusic?.album"> · {{ playerStore.currentMusic.album }}</span>
        </div>
      </div>

      <!-- 收藏按钮 (白光/粉紫高亮，杜绝突兀刺眼大红) -->
      <button
        class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        :title="playerStore.isFavorite(playerStore.currentMusic?.id || '') ? '取消喜欢' : '喜欢'"
        @click="playerStore.toggleFavorite(playerStore.currentMusic?.id || '')"
      >
        <Heart
          class="w-4 h-4 transition-colors"
          :class="playerStore.isFavorite(playerStore.currentMusic?.id || '')
            ? 'fill-rose-400 text-rose-400'
            : 'text-zinc-500 hover:text-white'"
        />
      </button>
    </div>

    <!-- 中间: 核心控制与进度条 (暗色磨砂玻璃实心圆钮) -->
    <div class="flex flex-col items-center justify-center flex-1 max-w-[560px] min-w-0 px-4">
      <!-- 控制按键组 -->
      <div class="flex items-center gap-5">
        <!-- 播放模式切换 -->
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          :title="playModeLabel"
          @click="playerStore.cyclePlayMode()"
        >
          <Shuffle v-if="playerStore.playMode === 'random'" class="w-4 h-4 text-sky-400" />
          <Repeat1 v-else-if="playerStore.playMode === 'single'" class="w-4 h-4 text-sky-400" />
          <Repeat v-else class="w-4 h-4" />
        </button>

        <!-- 上一首 -->
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="上一首 (Alt + Left)"
          @click="playerStore.playPrev()"
        >
          <SkipBack class="w-4 h-4 fill-current" />
        </button>

        <!-- 播放 / 暂停 (高质感纯白/玻璃光感圆按钮) -->
        <button
          class="w-9 h-9 rounded-full bg-white hover:bg-zinc-200 active:scale-95 text-zinc-900 flex items-center justify-center shadow-lg shadow-white/10 transition-all cursor-pointer"
          :title="playerStore.isPlaying ? '暂停 (空格键)' : '播放 (空格键)'"
          @click="playerStore.togglePlay()"
        >
          <Pause v-if="playerStore.isPlaying" class="w-4 h-4 fill-current" />
          <Play v-else class="w-4 h-4 fill-current ml-0.5" />
        </button>

        <!-- 下一首 -->
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="下一首 (Alt + Right)"
          @click="playerStore.playNext()"
        >
          <SkipForward class="w-4 h-4 fill-current" />
        </button>

        <!-- 歌词详情开关 -->
        <button
          class="w-8 h-8 rounded-full hidden sm:flex items-center justify-center transition-colors cursor-pointer"
          :class="playerStore.isDetailOpen ? 'text-sky-400 bg-sky-500/15' : 'text-zinc-400 hover:text-white hover:bg-white/10'"
          :title="playerStore.isDetailOpen ? '收起歌词详情 (Esc)' : '歌词大屏'"
          @click="playerStore.isDetailOpen = !playerStore.isDetailOpen"
        >
          <ChevronDown v-if="playerStore.isDetailOpen" class="w-4 h-4" />
          <Maximize2 v-else class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- 进度条 (细条毛玻璃轨道 + 纯蓝/白光圆点) -->
      <div class="w-full flex items-center gap-2.5 text-[10px] text-zinc-500 font-mono mt-1">
        <span class="w-8 text-right tabular-nums">{{ formatTime(playerStore.currentTime) }}</span>
        <div
          class="flex-1 h-3 flex items-center relative cursor-pointer group"
          @click="handleSeek"
        >
          <div class="w-full h-1 group-hover:h-1.5 bg-white/10 rounded-full transition-all overflow-hidden relative">
            <div
              class="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
              :style="{ width: `${playerStore.progressPercent}%` }"
            ></div>
          </div>
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            :style="{ left: `${playerStore.progressPercent}%` }"
          ></div>
        </div>
        <span class="w-8 tabular-nums">{{ formatTime(playerStore.duration) }}</span>
      </div>
    </div>

    <!-- 右侧: 辅助功能 (音量、EQ、桌面歌词、播放列表) -->
    <div class="flex items-center justify-end gap-2.5 w-[260px] flex-shrink-0 min-w-0">
      <!-- EQ 均衡器 -->
      <button
        class="p-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
        :class="playerStore.isSoundEffectOpen
          ? 'bg-white/15 text-white border border-white/20'
          : 'text-zinc-400 hover:text-white hover:bg-white/10'"
        title="均衡器 (EQ)"
        @click="playerStore.isSoundEffectOpen = true"
      >
        <Sliders class="w-4 h-4" />
      </button>

      <!-- 桌面歌词开关 ("词"按钮) -->
      <button
        class="px-2 py-0.5 rounded-md border text-[11px] font-bold transition-all cursor-pointer"
        :class="playerStore.isDesktopLyricOpen
          ? 'border-sky-400/80 text-sky-400 bg-sky-500/15 shadow-sm shadow-sky-500/20'
          : 'border-white/15 text-zinc-400 hover:text-white hover:border-white/30'"
        title="桌面歌词"
        @click="handleToggleDesktopLyric"
      >
        词
      </button>

      <!-- 播放列表 -->
      <button
        class="p-2 rounded-lg text-xs font-medium transition-all cursor-pointer relative"
        :class="playerStore.isQueueOpen
          ? 'bg-white/15 text-white border border-white/20'
          : 'text-zinc-400 hover:text-white hover:bg-white/10'"
        title="播放列表"
        @click="playerStore.isQueueOpen = !playerStore.isQueueOpen"
      >
        <ListMusic class="w-4 h-4" />
        <span
          v-if="playerStore.playlist.length > 0"
          class="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full bg-sky-500 text-[9px] text-white font-bold font-mono leading-none shadow-sm"
        >
          {{ playerStore.playlist.length > 99 ? '99+' : playerStore.playlist.length }}
        </span>
      </button>

      <!-- 音量调节 -->
      <div class="flex items-center gap-2 pl-1">
        <button
          class="text-zinc-400 hover:text-white transition-colors p-1 cursor-pointer"
          :title="playerStore.isMuted ? '取消静音' : '静音'"
          @click="playerStore.toggleMute()"
        >
          <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-4 h-4 text-sky-400" />
          <Volume1 v-else-if="playerStore.volume < 0.5" class="w-4 h-4" />
          <Volume2 v-else class="w-4 h-4" />
        </button>
        <input
          v-model.number="playerStore.volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="w-18 h-1 bg-white/10 rounded appearance-none accent-sky-400 cursor-pointer"
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
