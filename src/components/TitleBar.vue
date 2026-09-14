<template>
  <header
    data-tauri-drag-region
    class="h-9 w-full flex items-center justify-between px-3 select-none bg-zinc-100/70 dark:bg-zinc-950/70 border-b border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl z-50 text-xs"
  >
    <!-- 左侧标题与状态 -->
    <div class="flex items-center gap-2 pointer-events-none pl-1">
      <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
      <span class="font-semibold text-zinc-600 dark:text-zinc-300 text-[11px] tracking-wide">
        LX Music X
      </span>
      <span class="text-[10px] text-zinc-400 font-normal">· 重构体验版</span>
    </div>

    <!-- 右侧系统窗口控制按钮 (Windows 11 / macOS 极简无边框设计) -->
    <div class="flex items-center h-full -mr-3">
      <!-- 最小化 -->
      <button
        class="w-11 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
        title="最小化"
        @click="minimizeWindow"
      >
        <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
          <rect width="10" height="1" rx="0.5" />
        </svg>
      </button>

      <!-- 最大化 / 还原 -->
      <button
        class="w-11 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
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
        class="w-11 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#e81123] transition-colors"
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
