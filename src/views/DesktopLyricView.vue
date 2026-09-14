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
        <span class="text-emerald-400 font-bold">♪</span>
        <span class="font-medium truncate">{{ songInfo || 'LX Music X 桌面歌词' }}</span>
      </div>

      <!-- 控制按键: 切歌、播放/暂停、字号、锁定 -->
      <div class="flex items-center gap-3">
        <button class="hover:text-emerald-400 cursor-pointer text-sm transition" title="上一首" @click="controlAction('prev')">
          ⏮
        </button>
        <button class="hover:text-emerald-400 cursor-pointer text-sm transition font-bold" :title="isPlaying ? '暂停' : '播放'" @click="controlAction('toggle-play')">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="hover:text-emerald-400 cursor-pointer text-sm transition" title="下一首" @click="controlAction('next')">
          ⏭
        </button>

        <span class="w-[1px] h-3 bg-white/20"></span>

        <button class="hover:text-emerald-400 cursor-pointer text-xs" title="调小字号" @click="changeFontSize(-2)">
          A-
        </button>
        <button class="hover:text-emerald-400 cursor-pointer text-xs" title="调大字号" @click="changeFontSize(2)">
          A+
        </button>

        <span class="w-[1px] h-3 bg-white/20"></span>

        <button
          class="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-white transition cursor-pointer font-medium text-[11px]"
          title="点击锁定鼠标穿透 (解锁请在托盘菜单或按快捷键)"
          @click="lockWindow"
        >
          <span>🔓</span>
          <span>锁定穿透</span>
        </button>
      </div>
    </div>

    <!-- 锁定穿透短暂悬浮提示 -->
    <div
      v-if="showLockToast"
      class="absolute top-2 px-4 py-1.5 rounded-full bg-emerald-500/90 text-white text-xs shadow-lg backdrop-blur z-50 animate-fade-in"
    >
      已锁定鼠标穿透 · 可通过托盘菜单解锁或控制
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
import { setDesktopLyricIgnoreMouse, listenLyricSync, emitPlayerControl, LyricSyncPayload } from '@/core/tauriBridge'
import { UnlistenFn } from '@tauri-apps/api/event'

const isHovered = ref(false)
const isLocked = ref(false)
const showLockToast = ref(false)
const fontSize = ref(24)

const currentLine = ref('原谅我这一生不羁放纵爱自由')
const nextLine = ref('也会怕有一天会跌倒')
const isPlaying = ref(true)
const songInfo = ref('海阔天空 - Beyond')

let unlistenSync: UnlistenFn | undefined

onMounted(async () => {
  unlistenSync = await listenLyricSync((payload: LyricSyncPayload) => {
    currentLine.value = payload.currentLine
    nextLine.value = payload.nextLine
    isPlaying.value = payload.isPlaying
    songInfo.value = `${payload.songName} - ${payload.singer}`
  })
})

onUnmounted(() => {
  unlistenSync?.()
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
  isLocked.value = true
  isHovered.value = false
  showLockToast.value = true
  setTimeout(() => {
    showLockToast.value = false
  }, 2500)
  await setDesktopLyricIgnoreMouse(true)
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
