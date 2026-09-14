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

    <!-- 主体区域：左侧边栏 + 右侧内容页 -->
    <div class="flex-1 flex overflow-hidden">
      <Sidebar />
      <main class="flex-1 overflow-y-auto bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm">
        <RouterView />
      </main>
    </div>

    <!-- 底部常驻播放器控制器 -->
    <PlayerBar />

    <!-- 沉浸式全屏流光歌词大屏 -->
    <PlayerDetail />

    <!-- 10 段专业 EQ 音效调节悬浮层 -->
    <SoundEffectModal />
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
import { usePlayerStore } from '@/store/player'

import { listenRemoteControls } from '@/core/tauriBridge'
import { UnlistenFn } from '@tauri-apps/api/event'

const route = useRoute()
const playerStore = usePlayerStore()
const isDesktopLyricRoute = computed(() => route.path === '/desktop-lyric')
let unlistens: UnlistenFn[] = []

function handleGlobalKeydown(e: KeyboardEvent) {
  // 如果输入框处于焦点中，则不触发播放快捷键
  const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea') return

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
    }
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleGlobalKeydown)

  // 监听桌面悬浮歌词窗口与系统托盘的控制
  unlistens = await listenRemoteControls({
    onTogglePlay: () => playerStore.togglePlay(),
    onPrev: () => playerStore.playPrev(),
    onNext: () => playerStore.playNext(),
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  for (const fn of unlistens) {
    fn()
  }
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