<template>
  <!-- 如果是桌面悬浮歌词独立窗口路由 -->
  <div v-if="isDesktopLyricRoute" class="w-screen h-screen overflow-hidden bg-transparent">
    <RouterView />
  </div>

  <!-- 主程序窗口布局 (现代高级暗黑毛玻璃风格) -->
  <div
    v-else
    class="w-screen h-screen flex flex-col overflow-hidden bg-[#08090d] text-zinc-100 select-none font-sans relative"
  >
    <!-- 背景壁纸图 (暗色二次元星空夜景壁纸) -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transform scale-100 transition-all duration-700 opacity-60"
      :style="{ backgroundImage: `url(${wallpaperImg})` }"
    ></div>

    <!-- 柔和暗色微光渐变遮罩 (保证文字和UI控件的高清对比度，同时让夜空星光与水景倒影透出) -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#08090d]/65 via-[#08090d]/50 to-[#08090d]/75 pointer-events-none"></div>

    <!-- 顶部原生无边框标题栏 -->
    <TitleBar />
    <div v-if="backendError || backendState.playback.error" role="alert" class="px-4 py-1.5 text-xs bg-red-500/10 text-red-400 border-b border-red-500/20 flex items-center justify-between z-50">
      <span>{{ backendError || backendState.playback.error }}</span>
    </div>

    <!-- 主体区域：左侧边栏 + 右侧内容页 -->
    <div class="flex-1 flex overflow-hidden relative z-10">
      <Sidebar />
      <main class="flex-1 overflow-y-auto bg-black/20 backdrop-blur-sm">
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
import wallpaperImg from '@/assets/wallpaper.jpg'
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

