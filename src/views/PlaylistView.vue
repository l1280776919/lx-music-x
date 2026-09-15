<template>
  <div class="h-full flex flex-col p-4 md:p-6 space-y-4 max-w-7xl mx-auto overflow-hidden">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <h1 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">我的音乐</h1>
        <span class="text-xs text-zinc-400">共 {{ customLists.length }} 个歌单</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="desktop-btn-secondary"
          @click="handleImportLegacy"
        >
          <Download class="w-3.5 h-3.5" />
          <span>{{ importStatusText }}</span>
        </button>
        <button
          class="desktop-btn-primary"
          @click="createPlaylist"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>新建歌单</span>
        </button>
      </div>
    </div>

    <!-- 主体分栏: 左侧歌单选择 + 右侧歌单曲目 -->
    <div class="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden min-h-0">
      <!-- 左侧: 歌单列表 -->
      <aside class="w-full md:w-56 flex-shrink-0 flex flex-col gap-1 overflow-y-auto pr-1 max-h-48 md:max-h-full">
        <div
          v-for="list in customLists"
          :key="list.id"
          class="flex items-center justify-between px-3 py-2 rounded-lg border transition-colors cursor-pointer group text-xs"
          :class="selectedListId === list.id
            ? 'bg-brand-500/10 dark:bg-brand-500/15 border-brand-500/30 text-brand-600 dark:text-brand-400 font-semibold'
            : 'bg-white dark:bg-[#18181c] border-zinc-200/70 dark:border-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50'"
          @click="selectedListId = list.id"
        >
          <div class="flex items-center gap-2.5 truncate">
            <component :is="getPlaylistIcon(list.id)" class="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div class="truncate">
              <div class="truncate font-medium">{{ list.name }}</div>
              <div class="text-[10px] text-zinc-400 font-normal">{{ list.songs.length }} 首</div>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              v-if="list.id !== 'fav' && list.id !== 'local'"
              class="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-colors"
              title="删除歌单"
              @click.stop="deletePlaylist(list.id)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <!-- 右侧: 当前歌单内歌曲列表 -->
      <main class="flex-1 flex flex-col bg-white dark:bg-[#18181c] rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 overflow-hidden shadow-sm min-h-0">
        <!-- 歌单头部信息 -->
        <div class="p-4 border-b border-zinc-200/70 dark:border-zinc-800/70 flex items-center gap-4 flex-shrink-0 bg-zinc-50/50 dark:bg-[#141416]/50">
          <div class="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
            <component :is="getPlaylistIcon(selectedListId)" class="w-8 h-8 text-brand-500" />
          </div>

          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {{ currentList?.name }}
              </h2>
            </div>
            <div class="text-xs text-zinc-400">
              共 {{ currentList?.songs.length || 0 }} 首曲目
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="currentList?.songs.length"
              class="desktop-btn-primary"
              @click="playCurrentListAll"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span>播放全部</span>
            </button>

            <button
              v-if="selectedListId === 'local'"
              class="desktop-btn-secondary"
              @click="handleScanLocalMusic"
            >
              <FolderSearch class="w-3.5 h-3.5" />
              <span>扫描本地目录</span>
            </button>
          </div>
        </div>

        <!-- 列表表头 -->
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

        <!-- 歌曲列表滚动区 -->
        <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
          <div v-if="!currentList?.songs.length" class="py-20 text-center text-zinc-400 text-xs space-y-2">
            <div>歌单暂无歌曲</div>
            <div class="text-[11px] text-zinc-400">去“全网搜索”添加歌曲，或点击上方导入历史歌单</div>
          </div>

          <div
            v-for="(song, idx) in currentList?.songs"
            :key="song.id"
            class="h-11 px-4 flex items-center justify-between text-xs transition-colors group cursor-pointer border-b border-zinc-100/70 dark:border-zinc-800/30 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50"
            @dblclick="playSelectedSong(song)"
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
              {{ song.album || '本地音乐' }}
            </div>

            <!-- 时长与操作 -->
            <div class="flex items-center justify-end gap-3 w-24 flex-shrink-0 font-mono text-zinc-400">
              <span class="text-right text-[11px]">{{ song.interval || '03:45' }}</span>

              <div class="flex items-center gap-1 w-10 justify-end">
                <button
                  class="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                  :class="playlistStore.isFavorite(song.id) ? 'text-rose-500' : ''"
                  :title="playlistStore.isFavorite(song.id) ? '已喜欢' : '喜欢'"
                  @click.stop="playlistStore.toggleFavorite(song)"
                >
                  <Heart
                    class="w-3.5 h-3.5"
                    :class="playlistStore.isFavorite(song.id) ? 'fill-current' : ''"
                  />
                </button>
                <button
                  class="p-1 text-zinc-400 hover:text-brand-500 transition-colors"
                  title="播放"
                  @click.stop="playSelectedSong(song)"
                >
                  <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
                <button
                  v-if="selectedListId !== 'local'"
                  class="p-1 text-zinc-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="从歌单移除"
                  @click.stop="playlistStore.removeSongFromList(selectedListId, song.id)"
                >
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, Plus, HardDrive, Heart, ListMusic, Archive, Folder, FolderSearch, Play, Trash2 } from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'
import { usePlaylistStore } from '@/store/playlist'
import { scanAndImportLegacyData, openFolderPicker, scanLocalMusic } from '@/core/tauriBridge'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2310b981"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()
const selectedListId = ref('fav')
const importStatusText = ref('一键迁移原版歌单')

const customLists = computed(() => playlistStore.customLists)

function getPlaylistIcon(id: string) {
  if (id === 'local') return HardDrive
  if (id === 'fav') return Heart
  if (id === 'default') return ListMusic
  if (id.startsWith('legacy') || id.startsWith('imported')) return Archive
  return Folder
}

const currentList = computed(() => {
  return customLists.value.find((l) => l.id === selectedListId.value) || customLists.value[0]
})

onMounted(async () => {
  // 静默预检测原版数据库
    const res = await scanAndImportLegacyData().catch(() => null)
    if (res?.found && res.playlists.length > 0) {
    importStatusText.value = `导入原版歌单 (${res.total_songs}首)`
  }
})

async function handleScanLocalMusic() {
  try {
    const dir = await openFolderPicker()
    if (!dir) return
    const tracks = await scanLocalMusic(dir)
    if (!tracks || tracks.length === 0) {
      alert('所选目录中未发现音频文件 (支持 .mp3/.flac/.wav/.m4a/.ogg 等)')
      return
    }
    await playlistStore.setLocalSongs(tracks)
    selectedListId.value = 'local'
  } catch (err: any) {
    alert(`扫描本地音乐失败: ${err?.message || err}`)
  }
}

async function handleImportLegacy() {
  importStatusText.value = '正在扫描并导入...'
  try {
    const res = await scanAndImportLegacyData()
    if (res.found) {
        await playlistStore.importLegacyPlaylists(res.playlists)
      importStatusText.value = `✓ 导入成功 (${res.total_songs}首)`
      alert(`成功识别原版数据库！已导入 ${res.playlists.length} 个歌单，共 ${res.total_songs} 首歌曲。`)
    } else {
      importStatusText.value = '未发现原版数据'
      alert('未在默认目录下找到原版 lx-music-desktop 历史数据文件。')
    }
  } catch (err: any) {
    alert(`导入出错: ${err}`)
    importStatusText.value = '导入失败'
  }
}

async function createPlaylist() {
  const name = prompt('请输入新歌单名称:')
  if (name && name.trim()) {
    const newList = await playlistStore.createPlaylist(name.trim())
    selectedListId.value = newList.id
  }
}

async function deletePlaylist(listId: string) {
  if (confirm('确定要删除这个歌单吗？')) {
    await playlistStore.removePlaylist(listId)
    if (selectedListId.value === listId) {
      selectedListId.value = 'fav'
    }
  }
}

async function playSelectedSong(song: MusicItem) {
  if (currentList.value?.songs && currentList.value.songs.length > 0) {
    const idx = currentList.value.songs.findIndex((s) => s.id === song.id)
    playerStore.replaceQueue(currentList.value.songs, Math.max(0, idx))
  } else {
    playerStore.addToQueue(song, true)
  }
}

async function playCurrentListAll() {
  if (currentList.value?.songs.length) {
    playerStore.replaceQueue(currentList.value.songs)
  }
}
</script>

