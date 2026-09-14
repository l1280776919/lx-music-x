<template>
  <header
    data-tauri-drag-region
    class="h-10 w-full flex items-center justify-between px-4 select-none bg-white/40 dark:bg-zinc-900/40 border-b border-zinc-200/40 dark:border-zinc-800/40 backdrop-blur z-50 text-xs"
  >
    <!-- 左侧占位/搜索框提示 -->
    <div class="flex items-center gap-2 pointer-events-none text-zinc-400">
      <span class="font-medium text-zinc-500 dark:text-zinc-400">洛雪音乐 · 新一代重构版</span>
    </div>

    <!-- 右侧原生窗口控制按钮 -->
    <div class="flex items-center -mr-2">
      <button
        class="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition"
        title="最小化"
        @click="minimizeWindow"
      >
        一
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition"
        title="最大化"
        @click="maximizeWindow"
      >
        口
      </button>
      <button
        class="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-500 transition"
        title="关闭"
        @click="closeWindow"
      >
        ✕
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'

async function minimizeWindow() {
  try {
    const win = getCurrentWebviewWindow()
    await win.minimize()
  } catch (e) {
    console.warn('Non-tauri environment', e)
  }
}

async function maximizeWindow() {
  try {
    const win = getCurrentWebviewWindow()
    await win.toggleMaximize()
  } catch (e) {
    console.warn('Non-tauri environment', e)
  }
}

async function closeWindow() {
  try {
    const win = getCurrentWebviewWindow()
    await win.close()
  } catch (e) {
    console.warn('Non-tauri environment', e)
  }
}
</script>
