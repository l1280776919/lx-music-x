<template>
  <header
    data-tauri-drag-region
    class="h-8 w-full flex items-center justify-between px-3 select-none z-50 text-xs transition-colors"
    :class="playerStore.isDetailOpen
      ? 'bg-[#121214] border-b border-white/10 text-white'
      : 'bg-zinc-100 dark:bg-[#121214] border-b border-zinc-200/80 dark:border-zinc-800/80'"
  >
    <!-- 左侧应用标题或返回按钮 -->
    <div class="flex items-center gap-2 pl-1">
      <button
        v-if="playerStore.isDetailOpen"
        class="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto cursor-pointer font-medium"
        title="收起播放详情 (Esc)"
        @click="playerStore.isDetailOpen = false"
      >
        <ChevronDown class="w-3.5 h-3.5" />
        <span>收起详情</span>
      </button>
      <div v-else class="flex items-center gap-2 pointer-events-none">
        <svg class="w-3.5 h-3.5 text-brand-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <span class="font-medium text-zinc-700 dark:text-zinc-300 text-xs tracking-tight">
          LX Music
        </span>
      </div>
    </div>

    <!-- 右侧系统窗口控制按钮 (Windows 11 / macOS 极简无边框设计) -->
    <div class="flex items-center h-full -mr-3">
      <!-- 最小化 -->
      <button
        class="w-11 h-8 flex items-center justify-center transition-colors cursor-pointer"
        :class="playerStore.isDetailOpen
          ? 'text-zinc-400 hover:text-white hover:bg-white/10'
          : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'"
        title="最小化"
        @click="minimizeWindow"
      >
        <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
          <rect width="10" height="1" rx="0.5" />
        </svg>
      </button>

      <!-- 最大化 / 还原 -->
      <button
        class="w-11 h-8 flex items-center justify-center transition-colors cursor-pointer"
        :class="playerStore.isDetailOpen
          ? 'text-zinc-400 hover:text-white hover:bg-white/10'
          : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'"
        :title="isMaximized ? '向下还原' : '最大化'"
        @click="maximizeWindow"
      >
        <svg v-if="!isMaximized" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="0.5" y="0.5" width="9" height="9" rx="1" />
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M2.5 2.5V0.5H9.5V7.5H7.5" />
          <rect x="0.5" y="2.5" width="7" height="7" rx="1" />
        </svg>
      </button>

      <!-- 关闭 -->
      <button
        class="w-11 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#e81123] transition-colors cursor-pointer"
        title="关闭"
        @click="closeWindow"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
          <path d="M1 1L9 9M9 1L1 9" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { isTauri } from '@/core/tauriBridge'
import { usePlayerStore } from '@/store/player'
import { ChevronDown } from 'lucide-vue-next'

const playerStore = usePlayerStore()
const isMaximized = ref(false)

onMounted(async () => {
  if (isTauri()) {
    try {
      const win = getCurrentWebviewWindow()
      isMaximized.value = await win.isMaximized()
      win.onResized(async () => {
        isMaximized.value = await win.isMaximized()
      })
    } catch {
      //
    }
  }
})

async function minimizeWindow() {
  if (!isTauri()) return
  try {
    const win = getCurrentWebviewWindow()
    await win.minimize()
  } catch (e) {
    console.warn('Minimize error:', e)
  }
}

async function maximizeWindow() {
  if (!isTauri()) return
  try {
    const win = getCurrentWebviewWindow()
    await win.toggleMaximize()
    isMaximized.value = await win.isMaximized()
  } catch (e) {
    console.warn('Maximize error:', e)
  }
}

async function closeWindow() {
  if (!isTauri()) {
    window.close()
    return
  }
  try {
    const win = getCurrentWebviewWindow()
    await win.close()
  } catch (e) {
    console.warn('Close error:', e)
  }
}
</script>
