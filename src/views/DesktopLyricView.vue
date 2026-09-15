<template>
  <div
    class="w-screen h-screen select-none flex flex-col justify-center items-center px-6 transition-all duration-300 relative group overflow-hidden"
    :class="isHovered && !isLocked ? 'bg-zinc-950/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]' : 'bg-transparent'"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 控制浮层 (悬浮时且未锁定时显示) -->
    <div
      v-if="isHovered && !isLocked"
      data-tauri-drag-region
      class="absolute top-2 inset-x-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs border border-white/10 backdrop-blur-md cursor-move z-50 shadow-lg"
    >
      <!-- 歌曲信息 -->
      <div class="flex items-center gap-2 text-zinc-300 truncate max-w-[200px]" data-tauri-drag-region>
        <Music2 class="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
        <span class="font-medium truncate text-[11px]">{{ songInfo || '洛雪音乐' }}</span>
      </div>

      <!-- 控制按键: 切歌、播放/暂停、字号、单/双行、翻译、锁定、关闭 -->
      <div class="flex items-center gap-1.5">
        <!-- 上一首 -->
        <button
          class="hover:text-sky-400 text-zinc-300 cursor-pointer transition flex items-center justify-center p-1 rounded hover:bg-white/5"
          title="上一首"
          @click="controlAction('prev')"
        >
          <SkipBack class="w-3.5 h-3.5 fill-current" />
        </button>

        <!-- 播放/暂停 -->
        <button
          class="hover:text-sky-400 text-zinc-200 cursor-pointer transition flex items-center justify-center p-1 rounded hover:bg-white/5 font-bold"
          :title="isPlaying ? '暂停' : '播放'"
          @click="controlAction('toggle-play')"
        >
          <Pause v-if="isPlaying" class="w-3.5 h-3.5 fill-current" />
          <Play v-else class="w-3.5 h-3.5 fill-current ml-0.5" />
        </button>

        <!-- 下一首 -->
        <button
          class="hover:text-sky-400 text-zinc-300 cursor-pointer transition flex items-center justify-center p-1 rounded hover:bg-white/5"
          title="下一首"
          @click="controlAction('next')"
        >
          <SkipForward class="w-3.5 h-3.5 fill-current" />
        </button>

        <span class="w-[1px] h-3 bg-white/20 mx-0.5"></span>

        <!-- 字号调节 -->
        <button
          class="hover:text-sky-400 text-zinc-300 cursor-pointer text-xs px-1.5 py-0.5 rounded hover:bg-white/5 font-semibold"
          title="调小字号"
          @click="changeFontSize(-2)"
        >
          A-
        </button>
        <span class="text-[10px] text-zinc-400 font-mono select-none">{{ fontSize }}</span>
        <button
          class="hover:text-sky-400 text-zinc-300 cursor-pointer text-xs px-1.5 py-0.5 rounded hover:bg-white/5 font-semibold"
          title="调大字号"
          @click="changeFontSize(2)"
        >
          A+
        </button>

        <span class="w-[1px] h-3 bg-white/20 mx-0.5"></span>

        <!-- 单行 / 双行切换 -->
        <button
          class="text-[11px] px-2 py-0.5 rounded font-medium transition cursor-pointer"
          :class="isDualLine ? 'bg-sky-500/20 text-sky-400 border border-sky-400/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
          :title="isDualLine ? '切换为单行歌词' : '切换为双行歌词'"
          @click="toggleDualLine"
        >
          {{ isDualLine ? '双行' : '单行' }}
        </button>

        <!-- 翻译显示切换 -->
        <button
          class="text-[11px] px-2 py-0.5 rounded font-medium transition cursor-pointer"
          :class="showTrans ? 'bg-sky-500/20 text-sky-400 border border-sky-400/30' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
          :title="showTrans ? '隐藏歌词翻译' : '显示歌词翻译'"
          @click="toggleTrans"
        >
          译
        </button>

        <span class="w-[1px] h-3 bg-white/20 mx-0.5"></span>

        <!-- 锁定穿透按键 -->
        <button
          class="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-sky-500/30 hover:text-sky-300 border border-white/10 transition cursor-pointer font-medium text-[11px]"
          title="点击锁定鼠标穿透 (解锁请右键托盘菜单)"
          @click="lockWindow"
        >
          <Lock class="w-3 h-3 text-sky-400" />
          <span>锁定</span>
        </button>

        <!-- 关闭桌面歌词 -->
        <button
          class="p-1 rounded-md text-zinc-400 hover:text-red-300 hover:bg-red-500/20 transition cursor-pointer ml-0.5"
          title="关闭桌面歌词"
          @click="closeDesktopLyric"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- 锁定/解锁悬浮气泡通知 -->
    <div
      v-if="showLockToast"
      class="absolute top-2.5 px-4 py-1.5 rounded-full bg-sky-950/90 border border-sky-400/40 text-sky-200 text-xs shadow-xl backdrop-blur-md z-50 transition-all duration-300 flex items-center gap-2"
    >
      <Lock v-if="isLocked" class="w-3 h-3 text-sky-400" />
      <Unlock v-else class="w-3 h-3 text-sky-400" />
      <span>{{ lockToastMessage }}</span>
    </div>

    <!-- 歌词主文本渲染区 (支持单行/双行、翻译呈现与天青蓝发光) -->
    <div class="text-center space-y-1.5 pointer-events-none transition-all duration-200 w-full px-4">
      <div
        class="font-black tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-300 leading-tight truncate"
        :style="{
          fontSize: `${fontSize}px`,
          textShadow: '0 0 16px rgba(56, 189, 248, 0.55), 0 2px 6px rgba(0, 0, 0, 0.95)',
        }"
      >
        {{ currentLine || '洛雪音乐 · 享受听歌乐趣' }}
      </div>

      <!-- 双行歌词模式：优先展示当前行翻译，若无翻译则展示下一句歌词 -->
      <div
        v-if="isDualLine"
        class="font-medium drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)] transition-all duration-300 truncate"
        :class="hasTransToDisplay ? 'text-sky-300/90' : 'text-zinc-300/80'"
        :style="{ fontSize: `${Math.max(13, fontSize - 7)}px` }"
      >
        <template v-if="hasTransToDisplay">
          <span class="text-[10px] uppercase font-bold text-sky-400/90 bg-sky-400/15 px-1 py-0.2 rounded mr-1.5 border border-sky-400/25 align-middle">译</span>
          <span class="align-middle">{{ currentTrans }}</span>
        </template>
        <template v-else>
          <span class="align-middle">{{ nextLine }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Music2, SkipBack, SkipForward, Play, Pause, Lock, Unlock, X } from 'lucide-vue-next'
import { setDesktopLyricIgnoreMouse, toggleDesktopLyricWindow, listenLyricSync, emitPlayerControl, LyricSyncPayload } from '@/core/tauriBridge'
import { listen, emit, UnlistenFn } from '@tauri-apps/api/event'
import { initializeBackend } from '@/core/backend'

const isHovered = ref(false)
const isLocked = ref(false)
const showLockToast = ref(false)
const lockToastMessage = ref('已锁定鼠标穿透')

// 持久化配置键
const FONT_SIZE_KEY = 'lx_desktop_lyric_font_size'
const DUAL_LINE_KEY = 'lx_desktop_lyric_dual_line'
const SHOW_TRANS_KEY = 'lx_desktop_lyric_show_trans'

const fontSize = ref(Number(localStorage.getItem(FONT_SIZE_KEY)) || 24)
const isDualLine = ref(localStorage.getItem(DUAL_LINE_KEY) !== 'false')
const showTrans = ref(localStorage.getItem(SHOW_TRANS_KEY) !== 'false')

const currentLine = ref('洛雪音乐 · 享受听歌乐趣')
const currentTrans = ref('')
const nextLine = ref('静享好音乐')
const isPlaying = ref(true)
const songInfo = ref('LX Music X 桌面歌词')

const hasTransToDisplay = computed(() => showTrans.value && !!currentTrans.value.trim())

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

function changeFontSize(delta: number) {
  fontSize.value = Math.max(16, Math.min(38, fontSize.value + delta))
  localStorage.setItem(FONT_SIZE_KEY, String(fontSize.value))
}

function toggleDualLine() {
  isDualLine.value = !isDualLine.value
  localStorage.setItem(DUAL_LINE_KEY, String(isDualLine.value))
}

function toggleTrans() {
  showTrans.value = !showTrans.value
  localStorage.setItem(SHOW_TRANS_KEY, String(showTrans.value))
}

function handleMouseEnter() {
  if (!isLocked.value) isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}

async function lockWindow() {
  if (!isLocked.value) {
    await toggleLockState()
  }
}

async function closeDesktopLyric() {
  await toggleDesktopLyricWindow(false)
  try {
    await emit('desktop-lyric-visibility-change', false)
  } catch {}
}

function controlAction(action: 'toggle-play' | 'prev' | 'next') {
  emitPlayerControl(action)
}

onMounted(async () => {
  // 监听主窗口广播的歌词数据
  unlistenSync = await listenLyricSync((payload: LyricSyncPayload) => {
    if (payload.currentLine) currentLine.value = payload.currentLine
    currentTrans.value = payload.currentTrans || ''
    nextLine.value = payload.nextLine || ''
    isPlaying.value = payload.isPlaying
    songInfo.value = `${payload.songName} - ${payload.singer}`
  })

  // 监听托盘快捷键穿透锁定切换
  try {
    unlistenIgnore = await listen('tray-toggle-lyric-ignore', async () => {
      await toggleLockState()
    })
  } catch (e) {
    console.warn('Failed to listen tray-toggle-lyric-ignore:', e)
  }

  // 初始化后端连接，以便直接捕获 playback 事件
  try {
    await initializeBackend()
  } catch {}
})

onUnmounted(() => {
  unlistenSync?.()
  unlistenIgnore?.()
})
</script>

<style scoped>
:global(body) {
  background: transparent !important;
  overflow: hidden;
}
</style>
