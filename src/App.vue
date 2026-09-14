<template>
  <!-- 如果是桌面悬浮歌词独立窗口路由 -->
  <div v-if="isDesktopLyricRoute" class="w-screen h-screen overflow-hidden bg-transparent">
    <RouterView />
  </div>

  <!-- 主程序窗口布局 -->
  <div
    v-else
    class="w-screen h-screen flex flex-col overflow-hidden bg-zinc-100/90 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 select-none font-sans relative"
  >
    <!-- 顶部原生无边框标题栏 -->
    <TitleBar />
    <div v-if="backendError || backendState.playback.error" role="alert" class="px-4 py-2 text-sm bg-red-950 text-red-100">
      {{ backendError || backendState.playback.error }}
    </div>
    <div v-else-if="backendState.playback.loading" role="status" class="px-4 py-1 text-xs text-emerald-500">正在加载音频…</div>

    <!-- 主体区域：左侧边栏 + 右侧内容页 -->
    <div class="flex-1 flex overflow-hidden">
      <Sidebar />
      <main class="flex-1 overflow-y-auto bg-gradient-to-br from-zinc-50/80 via-zinc-100/50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950">
        <RouterView />
      </main>
    </div>

    <!-- 底部常驻播放器控制器 -->
    <PlayerBar />

    <!-- 沉浸式全屏流光歌词大屏 -->
    <PlayerDetail />

    <!-- 10 段专业 EQ 音效调节悬浮层 -->
    <SoundEffectModal />

    <!-- 播放队列抽屉 -->
    <QueueDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import TitleBar from '@/components/TitleBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import PlayerBar from '@/components/PlayerBar.vue'
import PlayerDetail from '@/components/PlayerDetail.vue'
import SoundEffectModal from '@/components/SoundEffectModal.vue'
import QueueDrawer from '@/components/QueueDrawer.vue'
import { usePlayerStore } from '@/store/player'

import { backendError, backendState, initializeBackend } from '@/core/backend'

const route = useRoute()
const playerStore = usePlayerStore()
const isDesktopLyricRoute = computed(() => route.path === '/desktop-lyric')

function handleGlobalKeydown(e: KeyboardEvent) {
  // 如果输入框处于焦点中，则不触发播放快捷键
  const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return

  if (e.code === 'Space') {
    e.preventDefault()
    playerStore.togglePlay()
  } else if (e.code === 'ArrowRight' && e.altKey) {
    e.preventDefault()
    playerStore.playNext()
  } else if (e.code === 'ArrowLeft' && e.altKey) {
    e.preventDefault()
    playerStore.playPrev()
  } else if (e.code === 'ArrowRight') {
    e.preventDefault()
    playerStore.seekTime(playerStore.currentTime + 5)
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault()
    playerStore.seekTime(playerStore.currentTime - 5)
  } else if (e.code === 'ArrowUp') {
    e.preventDefault()
    playerStore.setVolume(playerStore.volume + 0.05)
  } else if (e.code === 'ArrowDown') {
    e.preventDefault()
    playerStore.setVolume(playerStore.volume - 0.05)
  } else if (e.code === 'Escape') {
    if (playerStore.isDetailOpen) {
      playerStore.isDetailOpen = false
    } else if (playerStore.isSoundEffectOpen) {
      playerStore.isSoundEffectOpen = false
    } else if (playerStore.isQueueOpen) {
      playerStore.isQueueOpen = false
    }
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeydown)

  await initializeBackend().catch(() => {})
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style>
/* 自定义现代平滑滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.2);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.4);
}
</style>
