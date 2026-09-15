<template>
  <div class="h-full flex flex-col p-4 md:p-6 space-y-3.5 max-w-7xl mx-auto overflow-hidden">
    <!-- 顶部搜索工具栏 -->
    <div class="flex-shrink-0 space-y-2.5">
      <!-- 搜索输入框与音源 Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-2.5">
        <!-- 搜索输入栏 -->
        <div class="relative flex-1 max-w-xl">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索歌曲名、歌手、歌词..."
            class="w-full h-9 pl-8 pr-16 rounded-lg bg-white dark:bg-[#18181c] border border-zinc-200/80 dark:border-zinc-700/80 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-brand-500 transition-colors shadow-sm"
            @keyup.enter="handleSearch"
          />
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
          <button
            v-if="keyword"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-medium transition-colors"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>

        <!-- 音源平台选择器 -->
        <div class="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            v-for="source in supportedSources"
            :key="source.id"
            class="px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
            :class="activeSource === source.id
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 hover:text-zinc-900 dark:hover:text-zinc-200'"
            @click="switchSource(source.id)"
          >
            {{ source.name }}
          </button>
        </div>
      </div>

      <!-- 热门关键词快捷标签与结果统计 -->
      <div class="flex items-center justify-between text-[11px] text-zinc-400">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span>热门:</span>
          <button
            v-for="tag in hotTags"
            :key="tag"
            class="px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
            @click="searchTag(tag)"
          >
            {{ tag }}
          </button>
        </div>

        <span v-if="totalCount > 0" class="font-mono">
          找到 {{ totalCount }} 条结果
        </span>
      </div>
    </div>

    <p v-if="searchError" role="alert" class="text-xs text-red-500 flex-shrink-0">{{ searchError }}</p>

    <!-- 搜索结果列表表格 -->
    <div class="flex-1 flex flex-col bg-white dark:bg-[#18181c] rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-sm min-h-0">
      <!-- Loading 状态 -->
      <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-400 text-xs py-20">
        <div class="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <div>正在搜索中...</div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="results.length === 0" class="flex-1 flex flex-col items-center justify-center text-zinc-400 py-20 space-y-2 text-xs">
        <Music2 class="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
        <div>输入关键词搜索全网音乐</div>
      </div>

      <!-- 结果列表 -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- 表头 -->
        <div class="h-9 px-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-[#141416] border-b border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between flex-shrink-0 select-none">
          <div class="flex items-center gap-3 w-[45%] min-w-[240px]">
            <span class="w-8 text-center">#</span>
            <span class="flex-1">歌曲标题</span>
          </div>
          <div class="w-[25%] hidden sm:block truncate pr-2">歌手</div>
          <div class="w-[20%] hidden md:block truncate pr-2">专辑</div>
          <div class="flex items-center justify-end gap-3 w-24">
            <span class="text-right">时长</span>
            <span class="w-10 text-center">操作</span>
          </div>
        </div>

        <!-- 歌曲行列表 -->
        <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
          <div
            v-for="(song, idx) in results"
            :key="song.id"
            class="h-11 px-4 flex items-center justify-between text-xs transition-colors group cursor-pointer border-b border-zinc-100/70 dark:border-zinc-800/30 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50"
            @dblclick="playSong(song)"
          >
            <!-- 序号与标题 -->
            <div class="flex items-center gap-3 w-[45%] min-w-[240px] overflow-hidden">
              <div class="w-8 text-center flex-shrink-0 font-mono text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                {{ (idx + 1).toString().padStart(2, '0') }}
              </div>

              <!-- 封面 -->
              <div class="w-7 h-7 rounded overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
                <img
                  :src="song.pic || defaultCover"
                  alt="cover"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
              </div>

              <!-- 歌名 -->
              <span class="truncate font-medium flex-1 text-zinc-800 dark:text-zinc-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" :title="song.name">
                {{ song.name }}
              </span>
            </div>

            <!-- 歌手 -->
            <div class="w-[25%] hidden sm:block text-zinc-500 dark:text-zinc-400 truncate pr-2" :title="song.singer">
              {{ song.singer }}
            </div>

            <!-- 专辑 -->
            <div class="w-[20%] hidden md:block text-zinc-400 truncate pr-2" :title="song.album">
              {{ song.album || '单曲' }}
            </div>

            <!-- 时长与操作 -->
            <div class="flex items-center justify-end gap-3 w-24 flex-shrink-0 font-mono text-zinc-400">
              <span class="text-right text-[11px]">{{ song.interval }}</span>

              <div class="flex items-center gap-1 w-10 justify-end">
                <button
                  class="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                  :class="playerStore.isFavorite(song.id) ? 'text-rose-500' : ''"
                  :title="playerStore.isFavorite(song.id) ? '已喜欢' : '喜欢'"
                  @click.stop="playerStore.toggleFavorite(song)"
                >
                  <Heart
                    class="w-3.5 h-3.5"
                    :class="playerStore.isFavorite(song.id) ? 'fill-current' : ''"
                  />
                </button>
                <button
                  class="p-1 text-zinc-400 hover:text-brand-500 transition-colors"
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
const searchError = ref('')
let searchGeneration = 0

async function handleSearch() {
  if (!keyword.value.trim()) return
  isLoading.value = true
  const generation = ++searchGeneration
  searchError.value = ''
  try {
    const res = await searchOnlineMusic(keyword.value.trim(), activeSource.value)
    if (generation !== searchGeneration) return
    results.value = res.list
    totalCount.value = res.total
  } catch (err) {
    if (generation === searchGeneration) { searchError.value = String(err); results.value = []; totalCount.value = 0 }
  } finally {
    if (generation === searchGeneration) isLoading.value = false
  }
}

async function switchSource(sourceId: string) {
  activeSource.value = sourceId
  if (keyword.value.trim()) {
    await handleSearch()
  }
}

async function playSong(song: MusicItem) {
  playerStore.addToQueue(song, true)
}
</script>
