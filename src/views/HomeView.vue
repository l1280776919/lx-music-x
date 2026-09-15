<template>
  <div class="h-full w-full flex flex-col p-4 md:p-6 space-y-4 overflow-hidden">
    <!-- 顶部榜单分类切换与工具栏 -->
    <div class="flex-shrink-0 space-y-4">
      <!-- 榜单选择 Tabs (暗色毛玻璃药丸Tab) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          v-for="b in boards"
          :key="b.id"
          class="px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer select-none border"
          :class="activeBoardId === b.id
            ? 'bg-white/15 text-white font-semibold border-white/20 shadow-md backdrop-blur-md'
            : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border-white/[0.06]'"
          @click="switchBoard(b)"
        >
          {{ b.name }}
        </button>
      </div>

      <!-- 榜单操作栏 -->
      <div class="flex items-center justify-between pt-1">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-zinc-100 tracking-tight">
            {{ currentBoardName }}
          </h2>
          <span class="text-xs text-zinc-500 font-mono">共 {{ displaySongs.length }} 首</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="desktop-btn-primary"
            title="播放当前全部歌曲"
            @click="playAll"
          >
            <Play class="w-3.5 h-3.5 fill-current" />
            <span>播放全部</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 歌曲列表主体表格 (毛玻璃容器) -->
    <div class="flex-1 flex flex-col bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl min-h-0">
      <!-- 正在加载中 -->
      <div v-if="isLoadingBoard" class="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs py-20">
        <div class="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <div>加载榜单中...</div>
      </div>

      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- 表头 -->
        <div class="h-9 px-4 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 select-none">
          <div class="flex items-center gap-3 flex-1 min-w-[200px] overflow-hidden">
            <span class="w-10 text-center flex-shrink-0">#</span>
            <span class="flex-1">歌曲标题</span>
          </div>
          <div class="w-36 md:w-48 lg:w-60 flex-shrink-0 hidden sm:block truncate pr-3">歌手</div>
          <div class="w-32 lg:w-48 flex-shrink-0 hidden md:block truncate pr-3">专辑</div>
          <div class="flex items-center justify-end gap-3 w-28 flex-shrink-0">
            <span class="text-right">时长</span>
            <span class="w-14 text-center">操作</span>
          </div>
        </div>

        <!-- 歌曲行列表 -->
        <div class="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
          <div
            v-for="(item, index) in displaySongs"
            :key="item.id"
            class="h-12 px-4 flex items-center justify-between text-xs transition-colors group cursor-pointer border-b border-white/[0.03]"
            :class="isCurrentSong(item)
              ? 'bg-sky-500/[0.08] text-white'
              : 'hover:bg-white/[0.04]'"
            @dblclick="playSong(item, index)"
          >
            <!-- 序号与标题 -->
            <div class="flex items-center gap-3 flex-1 min-w-[200px] overflow-hidden pr-3">
              <div class="w-10 text-center flex-shrink-0">
                <span
                  v-if="isCurrentSong(item) && playerStore.isPlaying"
                  class="text-sky-400 font-bold"
                >
                  ▶
                </span>
                <span
                  v-else
                  class="font-mono text-zinc-500 group-hover:text-zinc-300"
                  :class="isCurrentSong(item) ? 'text-sky-400 font-semibold' : ''"
                >
                  {{ (index + 1).toString().padStart(2, '0') }}
                </span>
              </div>

              <!-- 封面缩略图 -->
              <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                <img
                  :src="item.pic || defaultCover"
                  alt="cover"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
              </div>

              <!-- 歌曲名 + SQ 标识 (精致银白微标签) -->
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span
                  class="truncate font-medium transition-colors"
                  :class="isCurrentSong(item) ? 'text-sky-400 font-bold' : 'text-zinc-200 group-hover:text-white'"
                  :title="item.name"
                >
                  {{ item.name }}
                </span>
                <span class="px-1.5 py-0.2 rounded bg-white/10 border border-white/20 text-[9px] font-bold text-zinc-200 font-mono scale-90 origin-left flex-shrink-0">
                  SQ
                </span>
              </div>
            </div>

            <!-- 歌手 -->
            <div
              class="w-36 md:w-48 lg:w-60 flex-shrink-0 hidden sm:block text-zinc-400 truncate pr-3 hover:text-zinc-200 transition-colors"
              :title="item.singer"
            >
              {{ item.singer }}
            </div>

            <!-- 专辑 -->
            <div
              class="w-32 lg:w-48 flex-shrink-0 hidden md:block text-zinc-500 truncate pr-3"
              :title="item.album"
            >
              {{ item.album || '单曲' }}
            </div>

            <!-- 时长与操作 -->
            <div class="flex items-center justify-end gap-3 w-28 flex-shrink-0 font-mono text-zinc-400">
              <span class="text-right text-[11px]">{{ item.interval }}</span>

              <div class="flex items-center gap-1.5 w-14 justify-end">
                <button
                  class="p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                  :class="playerStore.isFavorite(item.id) ? 'text-rose-400' : ''"
                  :title="playerStore.isFavorite(item.id) ? '已喜欢' : '喜欢'"
                  @click.stop="playerStore.toggleFavorite(item)"
                >
                  <Heart
                    class="w-3.5 h-3.5"
                    :class="playerStore.isFavorite(item.id) ? 'fill-rose-400 text-rose-400' : 'text-zinc-500 hover:text-rose-400'"
                  />
                </button>
                <button
                  class="p-1 text-zinc-400 hover:text-sky-400 transition-colors"
                  :title="isCurrentSong(item) && playerStore.isPlaying ? '暂停' : '播放'"
                  @click.stop="playSong(item, index)"
                >
                  <Pause v-if="isCurrentSong(item) && playerStore.isPlaying" class="w-3.5 h-3.5 fill-current text-sky-400" />
                  <Play v-else class="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Play, Pause, Heart } from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'
import { getLeaderboardSongs } from '@/core/onlineMusic'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2338bdf8"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

const playerStore = usePlayerStore()

const boards = [
  { id: '19723756', name: '云音乐飙升榜', source: 'wy' },
  { id: '3778678', name: '热歌榜', source: 'wy' },
  { id: '3779629', name: '新歌榜', source: 'wy' },
  { id: '2884035', name: '原创榜', source: 'wy' },
  { id: '2250011882', name: '抖音热歌榜', source: 'wy' },
  { id: '1978921795', name: '电音榜', source: 'wy' },
]

const activeBoardId = ref('19723756')
const boardSongs = ref<MusicItem[]>([])
const isLoadingBoard = ref(false)

const currentBoardName = computed(() => {
  return boards.find((b) => b.id === activeBoardId.value)?.name || '官方热门榜单'
})

const displaySongs = computed(() => {
  return boardSongs.value
})


const heroFeaturedSong = computed(() => {
  if (displaySongs.value.length > 0) {
    return displaySongs.value[0]
  }
  return null
})

function isCurrentSong(item: MusicItem): boolean {
  return playerStore.currentMusic?.id === item.id
}

async function switchBoard(b: typeof boards[number]) {
  activeBoardId.value = b.id
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

onMounted(async () => {
  await switchBoard(boards[0])
})

async function playSong(item: MusicItem, _index: number) {
  if (isCurrentSong(item)) {
    await playerStore.togglePlay()
  } else {
    if (displaySongs.value.length > 0) {
      playerStore.replaceQueue(displaySongs.value, Math.max(0, _index))
    } else {
      playerStore.addToQueue(item, true)
    }
  }
}

async function playAll() {
  const songs = displaySongs.value
  if (songs.length > 0) {
    playerStore.replaceQueue(songs)
  }
}
</script>
