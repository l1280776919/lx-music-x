<template>
  <div class="h-full flex flex-col p-6 space-y-5 max-w-6xl mx-auto overflow-hidden">
    <!-- 搜索页面顶部 -->
    <header class="flex-shrink-0 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">全网聚合搜索</h1>
      <p class="text-sm text-zinc-500">直连各大音源与自定义源，百万曲目一触即达</p>
    </header>

    <!-- 搜索输入栏 -->
    <div class="relative flex-shrink-0">
      <input
        v-model="keyword"
        type="text"
        placeholder="输入歌曲名、歌手、歌词片段回车搜索 (例如: 周杰伦、海阔天空、晴天)..."
        class="w-full px-5 py-4 pl-12 rounded-2xl bg-white/75 dark:bg-zinc-900/75 border border-zinc-200/60 dark:border-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 backdrop-blur-xl transition shadow-sm text-sm"
        @keyup.enter="handleSearch"
      />
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">🔍</span>
      <button
        v-if="keyword"
        class="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition active:scale-95 shadow-sm"
        @click="handleSearch"
      >
        搜索
      </button>
    </div>

    <!-- 音源平台选择 Chips -->
    <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
      <span class="text-xs text-zinc-400 mr-1 font-medium">平台:</span>
      <button
        v-for="source in supportedSources"
        :key="source.id"
        class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95"
        :class="activeSource === source.id
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
          : 'bg-white/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/60 border border-zinc-200/40 dark:border-zinc-700/40'"
        @click="switchSource(source.id)"
      >
        {{ source.name }}
      </button>

      <span v-if="totalCount > 0" class="ml-auto text-xs text-zinc-400 font-mono">
        找到 {{ totalCount }} 条结果
      </span>
    </div>

    <!-- 搜索结果列表主展示区 -->
    <div class="flex-1 flex flex-col bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm">
      <!-- Loading 状态 -->
      <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-400 py-32">
        <div class="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
        <div class="text-xs">正在跨源检索...</div>
      </div>

      <!-- 空状态提示 -->
      <div v-else-if="results.length === 0" class="flex-1 flex flex-col items-center justify-center text-zinc-400 py-32">
        <div class="text-4xl mb-2">🎵</div>
        <div class="text-sm font-medium">输入关键词回车搜索，享受海量音源畅听</div>
        <div class="text-xs text-zinc-500 mt-1">支持网易、酷狗、QQ、酷我、咪咕以及自定义源</div>
      </div>

      <!-- 结果列表 -->
      <div v-else class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
        <div
          v-for="(song, idx) in results"
          :key="song.id"
          class="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition group cursor-pointer"
          @dblclick="playSong(song)"
        >
          <div class="flex items-center gap-4 min-w-[240px]">
            <span class="w-6 text-center text-xs font-mono text-zinc-400 group-hover:text-emerald-500">{{ idx + 1 }}</span>
            <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
              <img v-if="song.pic" :src="song.pic" alt="cover" class="w-full h-full object-cover" />
              <span v-else>♪</span>
            </div>
            <div class="overflow-hidden">
              <div class="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition truncate">
                {{ song.name }}
              </div>
              <div class="text-xs text-zinc-400 mt-0.5 truncate">
                {{ song.singer }}
              </div>
            </div>
          </div>

          <div class="hidden md:block text-xs text-zinc-400 truncate max-w-xs">
            {{ song.album }}
          </div>

          <div class="flex items-center gap-4">
            <span class="text-xs text-zinc-400 font-mono">{{ song.interval }}</span>
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white transition text-zinc-600 dark:text-zinc-300"
              title="播放"
              @click.stop="playSong(song)"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchOnlineMusic, supportedSources } from '@/core/onlineMusic'
import { usePlayerStore, MusicItem } from '@/store/player'

const playerStore = usePlayerStore()
const keyword = ref('')
const activeSource = ref('wy')
const isLoading = ref(false)
const totalCount = ref(0)
const results = ref<MusicItem[]>([])

async function handleSearch() {
  if (!keyword.value.trim()) return
  isLoading.value = true
  try {
    const res = await searchOnlineMusic(keyword.value.trim(), activeSource.value)
    results.value = res.list
    totalCount.value = res.total
  } catch (err) {
    console.error('Search failed:', err)
  } finally {
    isLoading.value = false
  }
}

async function switchSource(sourceId: string) {
  activeSource.value = sourceId
  if (keyword.value.trim()) {
    await handleSearch()
  }
}

async function playSong(song: MusicItem) {
  // 添加到当前播放列表并立即播放
  playerStore.playlist.unshift(song)
  playerStore.currentIndex = 0
  await playerStore.playMusic(song)
}
</script>
