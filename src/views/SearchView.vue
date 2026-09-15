<template>
  <div class="h-full w-full flex flex-col p-4 md:p-6 space-y-3.5 overflow-hidden">
    <!-- 顶部搜索工具栏 -->
    <div class="flex-shrink-0 space-y-3">
      <!-- 搜索输入框与音源 Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <!-- 搜索输入栏 (暗黑磨砂玻璃输入框) -->
        <div class="relative flex-1 max-w-lg">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索歌曲名、歌手、歌词..."
            class="w-full h-9 pl-9 pr-16 rounded-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/10 focus:border-sky-500/60 text-xs text-zinc-100 placeholder-zinc-500 transition-all outline-none backdrop-blur-md shadow-inner"
            @keyup.enter="handleSearch"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 pointer-events-none" />
          <button
            v-if="keyword"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 text-white text-[11px] font-medium transition-all shadow-sm cursor-pointer backdrop-blur-sm"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>

        <!-- 音源平台选择器 (暗黑微光药丸标签) -->
        <div class="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            v-for="source in supportedSources"
            :key="source.id"
            class="px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none border"
            :class="activeSource === source.id
              ? 'bg-white/15 text-white font-semibold border-white/20 shadow-md backdrop-blur-md'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border-white/[0.06]'"
            @click="switchSource(source.id)"
          >
            {{ source.name }}
          </button>
        </div>
      </div>

      <!-- 热门关键词快捷标签与结果统计 -->
      <div class="flex items-center justify-between text-[11px] text-zinc-500">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-zinc-500">热门:</span>
          <button
            v-for="tag in hotTags"
            :key="tag"
            class="px-2.5 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-zinc-400 hover:text-sky-400 border border-white/[0.06] transition-colors cursor-pointer"
            @click="searchTag(tag)"
          >
            {{ tag }}
          </button>
        </div>

        <span v-if="totalCount > 0" class="font-mono text-zinc-400">
          找到 {{ totalCount }} 条结果
        </span>
      </div>
    </div>

    <p v-if="searchError" role="alert" class="text-xs text-rose-400 flex-shrink-0">{{ searchError }}</p>

    <!-- 搜索结果列表表格 (暗黑毛玻璃容器) -->
    <div class="flex-1 flex flex-col bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl min-h-0">
      <!-- Loading 状态 -->
      <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs py-20">
        <div class="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <div>正在搜索中...</div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="results.length === 0" class="flex-1 flex flex-col items-center justify-center text-zinc-500 py-20 space-y-2 text-xs">
        <Music2 class="w-8 h-8 text-zinc-600" />
        <div>输入关键词搜索全网音乐</div>
      </div>

      <!-- 结果列表 -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <!-- 表头 -->
        <div class="h-9 px-4 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 select-none">
          <div class="flex items-center gap-3 flex-1 min-w-[200px] overflow-hidden">
            <span class="w-10 text-center flex-shrink-0">#</span>
            <span class="flex-1">歌曲标题</span>
          </div>
          <div class="w-36 md:w-48 lg:w-60 flex-shrink-0 hidden sm:block truncate pr-3">歌手</div>
          <div class="w-32 lg:w-48 flex-shrink-0 hidden md:block truncate pr-3">专辑</div>
          <div class="flex items-center justify-end gap-3 w-32 flex-shrink-0">
            <span class="text-right">时长</span>
            <span class="w-20 text-center">操作</span>
          </div>
        </div>

        <!-- 歌曲行列表 -->
        <div class="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
          <div
            v-for="(song, idx) in results"
            :key="song.id"
            class="h-12 px-4 flex items-center justify-between text-xs transition-colors group cursor-pointer border-b border-white/[0.03] hover:bg-white/[0.04]"
            @dblclick="playSong(song)"
          >
            <!-- 序号与标题 -->
            <div class="flex items-center gap-3 flex-1 min-w-[200px] overflow-hidden pr-3">
              <div class="w-10 text-center flex-shrink-0 font-mono text-zinc-500 group-hover:text-zinc-300">
                {{ (idx + 1).toString().padStart(2, '0') }}
              </div>

              <!-- 封面 -->
              <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                <img
                  :src="song.pic || defaultCover"
                  alt="cover"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
              </div>

              <!-- 歌名 + SQ 标识 (精致银白微标签) -->
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="truncate font-medium text-zinc-200 group-hover:text-sky-400 transition-colors" :title="song.name">
                  {{ song.name }}
                </span>
                <span class="px-1.5 py-0.2 rounded bg-white/10 border border-white/20 text-[9px] font-bold text-zinc-200 font-mono scale-90 origin-left flex-shrink-0">
                  SQ
                </span>
              </div>
            </div>

            <!-- 歌手 -->
            <div class="w-36 md:w-48 lg:w-60 flex-shrink-0 hidden sm:block text-zinc-400 truncate pr-3 hover:text-zinc-200 transition-colors" :title="song.singer">
              {{ song.singer }}
            </div>

            <!-- 专辑 -->
            <div class="w-32 lg:w-48 flex-shrink-0 hidden md:block text-zinc-500 truncate pr-3" :title="song.album">
              {{ song.album || '单曲' }}
            </div>

            <!-- 时长与操作 (包含喜欢、离线下载、播放) -->
            <div class="flex items-center justify-end gap-3 w-32 flex-shrink-0 font-mono text-zinc-400">
              <span class="text-right text-[11px]">{{ song.interval }}</span>

              <div class="flex items-center gap-1.5 w-20 justify-end">
                <button
                  class="p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                  :class="playerStore.isFavorite(song.id) ? 'text-rose-400' : ''"
                  :title="playerStore.isFavorite(song.id) ? '已喜欢' : '喜欢'"
                  @click.stop="playerStore.toggleFavorite(song)"
                >
                  <Heart
                    class="w-3.5 h-3.5"
                    :class="playerStore.isFavorite(song.id) ? 'fill-rose-400 text-rose-400' : 'text-zinc-500 hover:text-rose-400'"
                  />
                </button>
                <button
                  class="p-1 text-zinc-400 hover:text-sky-400 transition-colors cursor-pointer"
                  :title="isSongDownloaded(song) ? '已在本地曲库' : '下载到本地'"
                  :disabled="downloadingSongIds.has(song.id)"
                  @click.stop="handleDownload(song)"
                >
                  <Loader2 v-if="downloadingSongIds.has(song.id)" class="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <CheckCircle2 v-else-if="isSongDownloaded(song)" class="w-3.5 h-3.5 text-emerald-400" />
                  <Download v-else class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1 text-zinc-400 hover:text-sky-400 transition-colors cursor-pointer"
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
import { Search, Music2, Play, Heart, Download, Loader2, CheckCircle2 } from 'lucide-vue-next'
import { searchOnlineMusic, supportedSources } from '@/core/onlineMusic'
import { usePlayerStore, MusicItem } from '@/store/player'
import { usePlaylistStore } from '@/store/playlist'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2338bdf8"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

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
const playlistStore = usePlaylistStore()
const downloadingSongIds = ref<Set<string>>(new Set())

function isSongDownloaded(song: MusicItem): boolean {
  const localList = playlistStore.customLists.find(l => l.id === 'local')
  if (!localList) return false
  return localList.songs.some(s => (s.name === song.name && s.singer === song.singer) || s.id === song.id)
}

async function handleDownload(song: MusicItem) {
  if (downloadingSongIds.value.has(song.id)) return
  downloadingSongIds.value.add(song.id)
  try {
    await playlistStore.downloadSong(song)
  } catch (err: any) {
    alert(`下载失败: ${err?.message || err}`)
  } finally {
    downloadingSongIds.value.delete(song.id)
  }
}

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
