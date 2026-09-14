<template>
  <div class="p-6 space-y-8 max-w-6xl mx-auto">
    <!-- 顶部欢迎与快捷状态 -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">发现音乐</h1>
        <p class="text-sm text-zinc-500 mt-1">全新交互设计 · 实时官方热榜 · 低内存高性能</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          @click="playAll"
        >
          <span>▶</span>
          <span>播放全部</span>
        </button>
      </div>
    </header>

    <!-- 特色架构横幅 (现代渐变毛玻璃风格) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl shadow-sm hover:border-emerald-500/40 transition duration-300">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-xl mb-3">⚡</div>
        <div class="text-emerald-500 dark:text-emerald-400 text-lg font-bold">极致轻量秒开</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          Tauri 2 架构替代 Electron，安装包仅 15MB，静置内存仅 40MB，随开随听无卡顿。
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-gradient-to-br from-blue-500/15 via-indigo-500/5 to-transparent border border-blue-500/20 backdrop-blur-xl shadow-sm hover:border-blue-500/40 transition duration-300">
        <div class="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl mb-3">🪟</div>
        <div class="text-blue-500 dark:text-blue-400 text-lg font-bold">原生桌面悬浮歌词</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          独立透明置顶窗口，支持动态鼠标穿透，毫秒级逐行高亮平滑对齐。
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 via-pink-500/5 to-transparent border border-purple-500/20 backdrop-blur-xl shadow-sm hover:border-purple-500/40 transition duration-300">
        <div class="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-xl mb-3">🎛️</div>
        <div class="text-purple-500 dark:text-purple-400 text-lg font-bold">10 段专业硬件 EQ</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          内置 Web Audio 高阶均衡器与空间混响模拟，沉浸式音质调教尽在掌握。
        </div>
      </div>
    </section>

    <!-- 精选热歌与排行榜 (接入真实网络榜单) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">官方热播榜单</h2>
          <!-- 榜单切换 Tabs -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/60 dark:bg-zinc-800 text-xs">
            <button
              v-for="b in boards"
              :key="b.id"
              class="px-3 py-1 rounded-lg font-medium transition"
              :class="activeBoardId === b.id ? 'bg-white dark:bg-zinc-700 text-emerald-500 shadow-sm font-bold' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'"
              @click="switchBoard(b)"
            >
              {{ b.name }}
            </button>
          </div>
        </div>
        <span class="text-xs text-zinc-400 font-mono">共 {{ displaySongs.length }} 首歌曲</span>
      </div>

      <div class="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40 shadow-sm">
        <!-- 正在加载中 -->
        <div v-if="isLoadingBoard" class="py-24 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs">
          <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div>正在实时更新榜单数据...</div>
        </div>

        <div
          v-for="(item, index) in displaySongs"
          v-else
          :key="item.id"
          class="flex items-center justify-between px-6 py-4 transition group cursor-pointer"
          :class="isCurrentSong(item) ? 'bg-emerald-500/10 dark:bg-emerald-500/15' : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40'"
          @dblclick="playSong(item, index)"
        >
          <!-- 歌曲序号与封面 -->
          <div class="flex items-center gap-4 min-w-[240px]">
            <div class="w-7 text-center">
              <div v-if="isCurrentSong(item) && playerStore.isPlaying" class="flex items-end justify-center gap-[2px] h-3.5">
                <span class="w-[2px] h-full bg-emerald-500 rounded-full animate-bounce"></span>
                <span class="w-[2px] h-2/3 bg-emerald-500 rounded-full animate-bounce delay-75"></span>
                <span class="w-[2px] h-4/5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
              </div>
              <span v-else class="text-sm font-semibold text-zinc-400 group-hover:text-emerald-500 transition">
                {{ index + 1 }}
              </span>
            </div>

            <!-- 歌曲封面缩略图 -->
            <div class="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative group/pic bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
              <img v-if="item.pic" :src="item.pic" alt="cover" class="w-full h-full object-cover group-hover/pic:scale-110 transition duration-300" />
              <span v-else>♪</span>
              <div
                class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                @click.stop="playSong(item, index)"
              >
                <span class="text-white text-xs">▶</span>
              </div>
            </div>

            <!-- 歌曲名与歌手 -->
            <div class="overflow-hidden">
              <div
                class="font-semibold text-sm truncate transition"
                :class="isCurrentSong(item) ? 'text-emerald-500 font-bold' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500'"
              >
                {{ item.name }}
              </div>
              <div class="text-xs text-zinc-400 mt-1 truncate">
                {{ item.singer }} · {{ item.album }}
              </div>
            </div>
          </div>

          <!-- 专辑名称 -->
          <div class="hidden md:block text-xs text-zinc-400 truncate max-w-xs">
            《{{ item.album }}》
          </div>

          <!-- 右侧时长与快捷操作 -->
          <div class="flex items-center gap-5">
            <!-- 喜欢按钮 -->
            <button
              class="text-sm transition opacity-60 hover:opacity-100"
              :class="playerStore.isFavorite(item.id) ? 'opacity-100 scale-110' : ''"
              title="喜欢"
              @click.stop="playerStore.toggleFavorite(item.id)"
            >
              {{ playerStore.isFavorite(item.id) ? '❤️' : '🤍' }}
            </button>

            <!-- 歌曲时长 -->
            <span class="text-xs text-zinc-400 font-mono w-12 text-right">{{ item.interval }}</span>

            <!-- 播放按钮 -->
            <button
              class="w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm"
              :class="isCurrentSong(item) && playerStore.isPlaying
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white text-zinc-600 dark:text-zinc-300'"
              @click.stop="playSong(item, index)"
            >
              <span class="text-xs font-bold">{{ isCurrentSong(item) && playerStore.isPlaying ? '⏸' : '▶' }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore, MusicItem } from '@/store/player'
import { getLeaderboardSongs } from '@/core/onlineMusic'

const playerStore = usePlayerStore()

const boards = [
  { id: 'wy__19723756', name: '云音乐飙升榜', source: 'wy' },
  { id: 'wy__3778678', name: '热歌榜', source: 'wy' },
  { id: 'wy__3779629', name: '新歌榜', source: 'wy' },
  { id: 'default', name: '精选演示', source: 'local' },
]

const activeBoardId = ref('default')
const boardSongs = ref<MusicItem[]>([])
const isLoadingBoard = ref(false)

const displaySongs = computed(() => {
  if (activeBoardId.value === 'default' || boardSongs.value.length === 0) {
    return playerStore.playlist
  }
  return boardSongs.value
})

function isCurrentSong(item: MusicItem): boolean {
  return playerStore.currentMusic?.id === item.id
}

async function switchBoard(b: typeof boards[number]) {
  activeBoardId.value = b.id
  if (b.id === 'default') {
    boardSongs.value = []
    return
  }

  isLoadingBoard.value = true
  try {
    const list = await getLeaderboardSongs(b.id, b.source)
    boardSongs.value = list
  } catch (e) {
    console.error('Failed to load board:', e)
  } finally {
    isLoadingBoard.value = false
  }
}

async function playSong(item: MusicItem, index: number) {
  if (isCurrentSong(item)) {
    await playerStore.togglePlay()
  } else {
    // 将正在播放的曲目追加到播放列表
    if (!playerStore.playlist.find(p => p.id === item.id)) {
      playerStore.playlist.splice(playerStore.currentIndex + 1, 0, item)
      playerStore.currentIndex++
    } else {
      playerStore.currentIndex = playerStore.playlist.findIndex(p => p.id === item.id)
    }
    await playerStore.playMusic(item)
  }
}

async function playAll() {
  const songs = displaySongs.value
  if (songs.length > 0) {
    playerStore.playlist = [...songs]
    playerStore.currentIndex = 0
    await playerStore.playMusic(songs[0])
  }
}
</script>
