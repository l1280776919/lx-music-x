<template>
  <div class="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
    <!-- 顶部欢迎区与快捷控制 -->
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">发现音乐</h1>
        <p class="text-sm text-zinc-500 mt-1">探索海量曲库 · 聚合各大官方热榜 · 高保真无损解析</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          @click="playAll"
        >
          <Play class="w-4 h-4 fill-current" />
          <span>播放全部</span>
        </button>
      </div>
    </header>

    <!-- 现代沉浸式音乐焦点 Banner -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-zinc-900 p-8 text-white shadow-xl">
      <!-- 背景氛围装饰 -->
      <div class="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
      <div class="absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center pointer-events-none opacity-25">
        <Disc class="w-48 h-48 animate-spin-slow text-white/50" />
      </div>

      <div class="relative z-10 max-w-xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-emerald-200 border border-white/10">
          <Sparkles class="w-3.5 h-3.5" />
          <span>每日精选探索</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-black leading-tight tracking-tight">
          {{ heroFeaturedSong ? heroFeaturedSong.name : '开启你的今日音乐漫游' }}
        </h2>
        <p class="text-sm text-white/80 line-clamp-2 leading-relaxed">
          {{ heroFeaturedSong ? `${heroFeaturedSong.singer} · 倾情呈现《${heroFeaturedSong.album}》` : '聚合全网热播金曲与个性化推荐，沉浸感受清澈高品质音质。' }}
        </p>
        <div class="flex items-center gap-3 pt-2">
          <button
            class="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-zinc-900 font-bold text-sm shadow-md hover:bg-zinc-100 active:scale-95 transition"
            @click="playHeroFeatured"
          >
            <Play class="w-4 h-4 fill-current" />
            <span>立即倾听</span>
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-md border border-white/10 active:scale-95 transition"
            @click="switchBoard(boards[0])"
          >
            <Flame class="w-4 h-4 text-amber-300" />
            <span>热播排行</span>
          </button>
        </div>
      </div>
    </section>

    <!-- 2. 精选推荐合辑 (Quick Picks Grid) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">精选探索合集</h2>
        <span class="text-xs text-zinc-400">官方与社区热门精选</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="card in recommendCards"
          :key="card.title"
          class="group p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-xl hover:border-emerald-500/40 hover:shadow-lg transition duration-300 cursor-pointer flex flex-col justify-between"
          @click="handleCardClick(card)"
        >
          <div class="space-y-3">
            <div class="aspect-square w-full rounded-xl overflow-hidden relative shadow-sm" :class="card.bgGradient">
              <div class="absolute inset-0 flex items-center justify-center text-white/30 group-hover:scale-110 transition duration-500">
                <Disc class="w-16 h-16 stroke-1" />
              </div>
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Play class="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
              <div class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur text-[10px] font-bold text-white">
                {{ card.badge }}
              </div>
            </div>
            <div>
              <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition line-clamp-1">
                {{ card.title }}
              </div>
              <div class="text-xs text-zinc-400 mt-1 line-clamp-1">
                {{ card.subtitle }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 精选热歌与排行榜 -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">官方热门榜单</h2>
          <!-- 榜单切换 Tabs -->
          <div class="flex items-center gap-1 p-1 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/80 text-xs backdrop-blur-md">
            <button
              v-for="b in boards"
              :key="b.id"
              class="px-3.5 py-1.5 rounded-xl font-semibold transition"
              :class="activeBoardId === b.id
                ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'"
              @click="switchBoard(b)"
            >
              {{ b.name }}
            </button>
          </div>
        </div>
        <span class="text-xs text-zinc-400 font-mono">共 {{ displaySongs.length }} 首歌曲</span>
      </div>

      <div class="bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40 shadow-sm">
        <!-- 正在加载中 -->
        <div v-if="isLoadingBoard" class="py-28 flex flex-col items-center justify-center gap-3 text-zinc-400 text-xs">
          <div class="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div>正在实时更新榜单数据...</div>
        </div>

        <div
          v-for="(item, index) in displaySongs"
          v-else
          :key="item.id"
          class="flex items-center justify-between px-6 py-3.5 transition group cursor-pointer"
          :class="isCurrentSong(item) ? 'bg-emerald-500/10 dark:bg-emerald-500/15' : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40'"
          @dblclick="playSong(item, index)"
        >
          <!-- 歌曲序号与封面 -->
          <div class="flex items-center gap-4 min-w-[220px] max-w-[45%]">
            <div class="w-7 text-center flex-shrink-0">
              <div v-if="isCurrentSong(item) && playerStore.isPlaying" class="flex items-end justify-center gap-[2px] h-3.5">
                <span class="w-[2.5px] h-full bg-emerald-500 rounded-full animate-bounce"></span>
                <span class="w-[2.5px] h-2/3 bg-emerald-500 rounded-full animate-bounce delay-75"></span>
                <span class="w-[2.5px] h-4/5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
              </div>
              <span v-else class="text-xs font-mono font-bold text-zinc-400 group-hover:text-emerald-500 transition">
                {{ index + 1 }}
              </span>
            </div>

            <!-- 歌曲封面缩略图 -->
            <div class="w-11 h-11 rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative group/pic bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
              <img
                :src="item.pic || defaultCover"
                alt="cover"
                referrerpolicy="no-referrer"
                class="w-full h-full object-cover group-hover/pic:scale-105 transition duration-300"
                @error="onImgError"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                @click.stop="playSong(item, index)"
              >
                <Play class="w-4 h-4 text-white fill-current" />
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
              <div class="text-xs text-zinc-400 mt-0.5 truncate">
                {{ item.singer }} · {{ item.album }}
              </div>
            </div>
          </div>

          <!-- 专辑名称 -->
          <div class="hidden md:block text-xs text-zinc-400 truncate max-w-[200px]">
            《{{ item.album }}》
          </div>

          <!-- 右侧时长与快捷操作 -->
          <div class="flex items-center gap-4 flex-shrink-0">
            <!-- 喜欢按钮 -->
            <button
              class="p-2 text-zinc-400 hover:text-red-500 transition active:scale-90"
              :class="playerStore.isFavorite(item.id) ? 'text-red-500' : ''"
              title="喜欢"
              @click.stop="playerStore.toggleFavorite(item)"
            >
              <Heart
                class="w-4 h-4"
                :class="playerStore.isFavorite(item.id) ? 'fill-current' : ''"
              />
            </button>

            <!-- 歌曲时长 -->
            <span class="text-xs text-zinc-400 font-mono w-12 text-right">{{ item.interval }}</span>

            <!-- 播放按钮 -->
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm active:scale-95"
              :class="isCurrentSong(item) && playerStore.isPlaying
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white text-zinc-600 dark:text-zinc-300'"
              @click.stop="playSong(item, index)"
            >
              <Pause v-if="isCurrentSong(item) && playerStore.isPlaying" class="w-3.5 h-3.5 fill-current" />
              <Play v-else class="w-3.5 h-3.5 fill-current ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Play, Pause, Heart, Sparkles, Flame, Disc } from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'
import { getLeaderboardSongs } from '@/core/onlineMusic'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2310b981"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

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

const recommendCards = [
  {
    title: '云音乐官方飙升榜',
    subtitle: '实时热度飙升最快 100 首单曲',
    badge: '实时飙升',
    bgGradient: 'bg-gradient-to-br from-rose-500 to-orange-700',
    boardId: '19723756',
    source: 'wy',
  },
  {
    title: '华语流行巅峰热歌',
    subtitle: '全网高热度热播主流金曲',
    badge: '官方热歌',
    bgGradient: 'bg-gradient-to-br from-emerald-500 to-teal-800',
    boardId: '3778678',
    source: 'wy',
  },
  {
    title: '流行新歌速递排行榜',
    subtitle: '第一时间发现华语及全球新歌',
    badge: '新歌速递',
    bgGradient: 'bg-gradient-to-br from-indigo-500 to-blue-800',
    boardId: '3779629',
    source: 'wy',
  },
  {
    title: '短视频热播抖音榜',
    subtitle: '全网刷屏高频出圈神曲',
    badge: '爆款神曲',
    bgGradient: 'bg-gradient-to-br from-purple-600 to-pink-800',
    boardId: '2250011882',
    source: 'wy',
  },
]

async function handleCardClick(card: typeof recommendCards[number]) {
  const b = boards.find((bd) => bd.id === card.boardId) || boards[0]
  await switchBoard(b)
  await playAll()
}

const activeBoardId = ref('19723756')
const boardSongs = ref<MusicItem[]>([])
const isLoadingBoard = ref(false)

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

async function playHeroFeatured() {
  if (heroFeaturedSong.value) {
    await playSong(heroFeaturedSong.value, 0)
  } else {
    await playAll()
  }
}

async function playAll() {
  const songs = displaySongs.value
  if (songs.length > 0) {
    playerStore.replaceQueue(songs)
  }
}
</script>
