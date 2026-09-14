<template>
  <div
    class="w-screen h-screen select-none flex flex-col justify-center items-center px-8 transition-all duration-300 relative group overflow-hidden"
    :class="isHovered && !isLocked ? 'bg-black/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl' : 'bg-transparent'"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 控制浮层 (悬浮时且未锁定时显示) -->
    <div
      v-if="isHovered && !isLocked"
      data-tauri-drag-region
      class="absolute top-2.5 inset-x-4 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-black/60 text-white text-xs border border-white/10 backdrop-blur-md cursor-move z-50"
    >
      <!-- 歌曲信息 -->
      <div class="flex items-center gap-2 text-zinc-300 truncate max-w-[240px]">
        <Music2 class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <span class="font-medium truncate">{{ songInfo || 'LX Music X 桌面歌词' }}</span>
      </div>

      <!-- 控制按键: 切歌、播放/暂停、字号、锁定 -->
      <div class="flex items-center gap-3">
        <button class="hover:text-emerald-400 cursor-pointer transition flex items-center justify-center p-1" title="上一首" @click="controlAction('prev')">
          <SkipBack class="w-3.5 h-3.5 fill-current" />
        </button>
        <button class="hover:text-emerald-400 cursor-pointer transition flex items-center justify-center p-1 font-bold" :title="isPlaying ? '暂停' : '播放'" @click="controlAction('toggle-play')">
          <Pause v-if="isPlaying" class="w-3.5 h-3.5 fill-current" />
          <Play v-else class="w-3.5 h-3.5 fill-current ml-0.5" />
        </button>
        <button class="hover:text-emerald-400 cursor-pointer transition flex items-center justify-center p-1" title="下一首" @click="controlAction('next')">
          <SkipForward class="w-3.5 h-3.5 fill-current" />
        </button>

        <span class="w-[1px] h-3 bg-white/20"></span>

        <button class="hover:text-emerald-400 cursor-pointer text-xs px-1" title="调小字号" @click="changeFontSize(-2)">
          A-
        </button>
        <button class="hover:text-emerald-400 cursor-pointer text-xs px-1" title="调大字号" @click="changeFontSize(2)">
          A+
        </button>

        <span class="w-[1px] h-3 bg-white/20"></span>

        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-white transition cursor-pointer font-medium text-[11px]"
          title="点击锁定鼠标穿透 (解锁请在托盘菜单或按快捷键)"
          @click="lockWindow"
        >
          <Lock class="w-3 h-3" />
          <span>锁定穿透</span>
        </button>
      </div>
    </div>

    <!-- 锁定穿透短暂悬浮提示 -->
    <div
      v-if="showLockToast"
      class="absolute top-2 px-4 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs shadow-lg backdrop-blur z-50 animate-fade-in"
    >
      {{ lockToastMessage }}
    </div>

    <!-- 歌词主文本渲染区 (支持单行/双行与柔和发光) -->
    <div class="text-center space-y-1.5 pointer-events-none transition-all duration-200">
      <div
        class="font-extrabold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-300"
        :style="{ fontSize: `${fontSize}px`, textShadow: '0 0 12px rgba(16, 185, 129, 0.4)' }"
      >
        {{ currentLine || '洛雪音乐 · 享受听歌乐趣' }}
      </div>
      <div
        class="font-medium text-white/75 drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)] transition-all duration-300"
        :style="{ fontSize: `${Math.max(12, fontSize - 8)}px` }"
      >
        {{ nextLine }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Music2, SkipBack, SkipForward, Play, Pause, Lock } from 'lucide-vue-next'
import { setDesktopLyricIgnoreMouse, listenLyricSync, emitPlayerControl, LyricSyncPayload } from '@/core/tauriBridge'
import { listen, UnlistenFn } from '@tauri-apps/api/event'

const isHovered = ref(false)
const isLocked = ref(false)
const showLockToast = ref(false)
const lockToastMessage = ref('已锁定鼠标穿透')
const fontSize = ref(24)

const currentLine = ref('洛雪音乐 · 开启你的音乐时光')
const nextLine = ref('Tauri 2.0 极速轻量重构')
const isPlaying = ref(true)
const songInfo = ref('LX Music X 桌面歌词')

let unlistenSync: UnlistenFn | undefined
let unlistenIgnore: UnlistenFn | undefined

async function toggleLockState() {
  isLocked.value = !isLocked.value
  isHovered.value = false
  lockToastMessage.value = isLocked.value
    ? '已锁定鼠标穿透 · 可通过托盘菜单解锁'
    : '已解除鼠标穿透 · 恢复鼠标交互'
  showLockToast.value = true
  setTimeout(() => {
    showLockToast.value = false
  }, 2500)
  await setDesktopLyricIgnoreMouse(isLocked.value)
}

onMounted(async () => {
  unlistenSync = await listenLyricSync((payload: LyricSyncPayload) => {
    currentLine.value = payload.currentLine
    nextLine.value = payload.nextLine
    isPlaying.value = payload.isPlaying
    songInfo.value = `${payload.songName} - ${payload.singer}`
  })

  try {
    unlistenIgnore = await listen('tray-toggle-lyric-ignore', async () => {
      await toggleLockState()
    })
  } catch (e) {
    console.warn('Failed to listen tray-toggle-lyric-ignore:', e)
  }
})

onUnmounted(() => {
  unlistenSync?.()
  unlistenIgnore?.()
})

function handleMouseEnter() {
  if (!isLocked.value) isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}

function changeFontSize(delta: number) {
  fontSize.value = Math.max(16, Math.min(36, fontSize.value + delta))
}

async function lockWindow() {
  if (!isLocked.value) {
    await toggleLockState()
  }
}

function controlAction(action: 'toggle-play' | 'prev' | 'next') {
  emitPlayerControl(action)
}
</script>

<style scoped>
:global(body) {
  background: transparent !important;
  overflow: hidden;
}
</style>
