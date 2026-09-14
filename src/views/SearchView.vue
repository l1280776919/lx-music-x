<template>
  <div class="h-full flex flex-col p-6 space-y-5 max-w-6xl mx-auto overflow-hidden">
    <!-- 搜索页面顶部 -->
    <header class="flex-shrink-0 space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">全网聚合搜索</h1>
      <p class="text-sm text-zinc-500">直连各大音源与自定义源，百万曲目一触即达</p>
    </header>

    <!-- 搜索输入栏 -->
    <div class="space-y-3 flex-shrink-0">
      <div class="relative">
        <input
          v-model="keyword"
          type="text"
          placeholder="输入歌曲名、歌手、歌词片段回车搜索 (例如: 周杰伦、海阔天空、晴天)..."
          class="w-full px-5 py-4 pl-12 pr-28 rounded-2xl bg-white/75 dark:bg-zinc-900/75 border border-zinc-200/60 dark:border-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 backdrop-blur-xl transition shadow-sm text-sm"
          @keyup.enter="handleSearch"
        />
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            v-if="keyword"
            class="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition active:scale-95 shadow-sm"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>
      </div>

      <!-- 热门关键词快捷标签 -->
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <span class="text-zinc-400 font-medium">热门搜索:</span>
        <button
          v-for="tag in hotTags"
          :key="tag"
          class="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
          @click="searchTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 音源平台选择 Chips -->
    <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
      <span class="text-xs text-zinc-400 mr-1 font-medium">音源平台:</span>
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
        <div class="text-xs">正在跨各大音源聚合检索中...</div>
      </div>

      <!-- 空状态提示 -->
      <div v-else-if="results.length === 0" class="flex-1 flex flex-col items-center justify-center text-zinc-400 py-28 space-y-3">
        <div class="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center text-zinc-400">
          <Music2 class="w-8 h-8 stroke-1" />
        </div>
        <div class="text-sm font-medium text-zinc-700 dark:text-zinc-300">输入关键词或点击上方热门标签探索全网好歌</div>
        <div class="text-xs text-zinc-400">支持网易云、酷狗、QQ、酷我、咪咕以及自定义 User API 脚本源</div>
      </div>

      <!-- 结果列表 -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- 列表表头 -->
        <div class="px-6 py-2.5 bg-zinc-50/70 dark:bg-zinc-800/40 text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800/40">
          <div class="flex items-center gap-4 min-w-[240px] max-w-[50%]">
            <span class="w-6 text-center">#</span>
            <span>歌曲标题与歌手</span>
          </div>
          <div class="hidden md:block text-left flex-1 pl-4">专辑</div>
          <div class="flex items-center gap-4">
            <span class="w-12 text-right">时长</span>
            <span class="w-16 text-center">操作</span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
          <div
            v-for="(song, idx) in results"
            :key="song.id"
            class="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition group cursor-pointer"
            @dblclick="playSong(song)"
          >
            <div class="flex items-center gap-4 min-w-[240px] max-w-[50%]">
              <span class="w-6 text-center text-xs font-mono text-zinc-400 group-hover:text-emerald-500">{{ idx + 1 }}</span>
              <div class="w-11 h-11 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 relative">
                <img
                  :src="song.pic || defaultCover"
                  alt="cover"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
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

            <div class="hidden md:block text-xs text-zinc-400 truncate flex-1 pl-4 max-w-xs">
              {{ song.album || '单曲' }}
            </div>

            <div class="flex items-center gap-4">
              <button
                class="p-2 text-zinc-400 hover:text-red-500 transition active:scale-90"
                :class="playerStore.isFavorite(song.id) ? 'text-red-500' : ''"
                title="喜欢"
                @click.stop="playerStore.toggleFavorite(song.id)"
              >
                <Heart
                  class="w-4 h-4"
                  :class="playerStore.isFavorite(song.id) ? 'fill-current' : ''"
                />
              </button>

              <span class="text-xs text-zinc-400 font-mono w-12 text-right">{{ song.interval }}</span>

              <button
                class="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white transition text-zinc-600 dark:text-zinc-300 active:scale-95"
                title="播放"
                @click.stop="playSong(song)"
              >
                <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Music2, Play, Heart } from 'lucide-vue-next'
import { searchOnlineMusic, supportedSources } from '@/core/onlineMusic'
import { usePlayerStore, MusicItem } from '@/store/player'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2310b981"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

const hotTags = ['周杰伦', '陈奕迅', '林俊杰', '海阔天空', '晴天', '起风了', '王菲', 'Taylor Swift']

function searchTag(tag: string) {
  keyword.value = tag
  handleSearch()
}

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
