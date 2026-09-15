<template>
  <header
    data-tauri-drag-region
    class="h-12 w-full flex items-center justify-between px-4 select-none z-50 text-xs transition-colors flex-shrink-0 bg-[#121316]/80 backdrop-blur-xl border-b border-white/[0.08]"
  >
    <!-- 左侧：暗黑磨砂质感徽标 + 标题 + 前进后退 -->
    <div class="flex items-center gap-3 pl-1">
      <!-- 播放详情打开时提供返回按钮 -->
      <button
        v-if="playerStore.isDetailOpen"
        class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-zinc-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all pointer-events-auto cursor-pointer font-medium shadow-sm"
        title="收起播放详情 (Esc)"
        @click="playerStore.isDetailOpen = false"
      >
        <ChevronDown class="w-3.5 h-3.5" />
        <span>收起详情</span>
      </button>

      <!-- 默认品牌区域 (暗色质感微标 + 专属高精度应用图标) -->
      <div v-else class="flex items-center gap-2 pointer-events-none">
        <div class="w-6 h-6 rounded-lg overflow-hidden border border-white/10 shadow-sm backdrop-blur-sm flex items-center justify-center">
          <img src="/app-logo.png" alt="LX Music" class="w-full h-full object-cover" />
        </div>
        <span class="font-bold text-zinc-100 text-xs tracking-wide">
          LX Music
        </span>
      </div>

      <!-- 经典前进/后退毛玻璃圆键 -->
      <div v-if="!playerStore.isDetailOpen" class="flex items-center gap-1.5 ml-2 pointer-events-auto">
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/[0.06] transition-all cursor-pointer"
          title="后退 (Alt + Left)"
          @click="goBack"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
        </button>
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/[0.06] transition-all cursor-pointer"
          title="前进 (Alt + Right)"
          @click="goForward"
        >
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- 中间：暗黑半透明毛玻璃搜索框快捷入口 -->
    <div class="flex-1 max-w-sm mx-4 pointer-events-auto">
      <div class="relative flex items-center">
        <input
          v-model="quickSearchKeyword"
          type="text"
          placeholder="搜索音乐、歌手、歌词..."
          class="w-full h-7 pl-8 pr-3 rounded-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-sky-500/50 text-[11px] text-zinc-200 placeholder-zinc-500 transition-all outline-none backdrop-blur-sm shadow-inner"
          @keyup.enter="handleQuickSearch"
        />
        <Search class="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
      </div>
    </div>

    <!-- 右侧系统窗口控制 (极简无边框设计) -->
    <div class="flex items-center h-full -mr-4 pointer-events-auto">
      <!-- 最小化 -->
      <button
        class="w-11 h-12 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        title="最小化"
        @click="minimizeWindow"
      >
        <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
          <rect width="10" height="1" rx="0.5" />
        </svg>
      </button>

      <!-- 最大化 / 还原 -->
      <button
        class="w-11 h-12 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
        class="w-11 h-12 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-500/80 transition-colors cursor-pointer"
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
import { useRouter } from 'vue-router'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { isTauri } from '@/core/tauriBridge'
import { usePlayerStore } from '@/store/player'
import { ChevronDown, ChevronLeft, ChevronRight, Search, Music2 } from 'lucide-vue-next'

const router = useRouter()
const playerStore = usePlayerStore()
const isMaximized = ref(false)
const quickSearchKeyword = ref('')

function goBack() {
  router.back()
}

function goForward() {
  router.forward()
}

function handleQuickSearch() {
  const kw = quickSearchKeyword.value.trim()
  if (kw) {
    router.push({ path: '/search', query: { q: kw } })
  } else {
    router.push('/search')
  }
}

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
    await win.hide()
  } catch (e) {
    console.warn('Close error:', e)
  }
}
</script>
