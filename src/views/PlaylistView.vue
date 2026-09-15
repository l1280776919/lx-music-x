<template>
  <div class="h-full w-full flex flex-col p-3 md:p-5 space-y-3 overflow-hidden">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between flex-shrink-0 px-0.5">
      <div class="flex items-center gap-3">
        <h1 class="text-lg font-bold text-white tracking-tight">我的音乐</h1>
        <span class="text-xs text-zinc-400 font-mono">{{ customLists.length }} 个歌单 · 共 {{ totalSongCount }} 首</span>
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
    <div class="flex-1 flex gap-3.5 overflow-hidden min-h-0">
      <!-- 左侧: 歌单列表 (支持一键折叠/展开，释放全部空间给右侧列表) -->
      <aside
        class="flex-shrink-0 flex flex-col bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300 select-none shadow-lg"
        :class="isSidebarCollapsed ? 'w-14' : 'w-48 lg:w-52'"
      >
        <!-- 侧栏头部 -->
        <div
          v-if="!isSidebarCollapsed"
          class="px-3.5 py-2.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]"
        >
          <span class="text-xs font-semibold text-zinc-300">歌单列表</span>
          <div class="flex items-center gap-1">
            <button
              class="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-sky-400 transition-colors"
              title="新建歌单"
              @click="createPlaylist"
            >
              <Plus class="w-3.5 h-3.5" />
            </button>
            <button
              class="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="折叠歌单列表，留出更大空间"
              @click="isSidebarCollapsed = true"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          v-else
          class="py-2.5 flex flex-col items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02]"
        >
          <button
            class="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-sky-400 transition-colors"
            title="展开歌单列表"
            @click="isSidebarCollapsed = false"
          >
            <ChevronRight class="w-4 h-4 text-sky-400" />
          </button>
        </div>

        <!-- 歌单列表条目 -->
        <div class="flex-1 overflow-y-auto p-1.5 space-y-1">
          <div
            v-for="list in customLists"
            :key="list.id"
            class="flex items-center rounded-xl border transition-all cursor-pointer group select-none"
            :class="[
              isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2 text-xs',
              selectedListId === list.id
                ? 'bg-white/15 text-white font-semibold border-white/20 shadow-md backdrop-blur-md'
                : 'bg-transparent hover:bg-white/[0.05] border-transparent text-zinc-400 hover:text-zinc-200'
            ]"
            :title="isSidebarCollapsed ? `${list.name} (${list.songs.length}首)` : ''"
            @click="selectedListId = list.id"
          >
            <div class="flex items-center gap-2.5 truncate">
              <component
                :is="getPlaylistIcon(list.id)"
                class="w-4 h-4 flex-shrink-0 transition-colors"
                :class="selectedListId === list.id ? 'text-sky-400' : 'text-zinc-400 group-hover:text-sky-400'"
              />
              <div v-if="!isSidebarCollapsed" class="truncate">
                <div class="truncate font-medium leading-tight">{{ list.name }}</div>
                <div class="text-[10px] text-zinc-500 font-normal mt-0.5">{{ list.songs.length }} 首</div>
              </div>
            </div>

            <div v-if="!isSidebarCollapsed" class="flex items-center gap-1 flex-shrink-0">
              <button
                v-if="list.id !== 'fav' && list.id !== 'local'"
                class="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="删除歌单"
                @click.stop="deletePlaylist(list.id)"
              >
                <Trash2 class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧: 当前歌单内歌曲列表 (宽屏铺满，自适应弹性布局) -->
      <main class="flex-1 flex flex-col bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl min-h-0 min-w-0">
        <!-- 歌单头部信息 -->
        <div class="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-4 flex-shrink-0 bg-white/[0.02]">
          <div class="flex items-center gap-3.5 min-w-0">
            <!-- 折叠状态下的快捷展开按钮 -->
            <button
              v-if="isSidebarCollapsed"
              class="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-sky-400 border border-white/[0.08] transition-colors flex-shrink-0"
              title="展开歌单列表"
              @click="isSidebarCollapsed = false"
            >
              <ChevronRight class="w-4 h-4" />
            </button>

            <!-- 歌单封面/图标 -->
            <div class="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0 text-sky-400 border border-white/10 shadow-inner">
              <component :is="getPlaylistIcon(selectedListId)" class="w-6 h-6 text-sky-400" />
            </div>

            <div class="min-w-0 space-y-0.5">
              <h2 class="text-base font-bold text-zinc-100 truncate">
                {{ currentList?.name }}
              </h2>
              <div class="text-xs text-zinc-400 flex items-center gap-2">
                <span>共 {{ currentList?.songs.length || 0 }} 首曲目</span>
                <span v-if="filterKeyword" class="text-sky-400 font-medium">· 筛选匹配 {{ filteredSongs.length }} 首</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2.5 flex-shrink-0">
            <!-- 歌单内快速过滤搜索框 -->
            <div class="relative flex items-center">
              <Search class="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 pointer-events-none" />
              <input
                v-model="filterKeyword"
                type="text"
                placeholder="搜索此歌单歌曲..."
                class="w-36 sm:w-44 md:w-52 h-8 pl-8 pr-7 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-200 placeholder-zinc-500 focus:border-sky-500/60 focus:bg-white/[0.07] outline-none transition-all"
              />
              <button
                v-if="filterKeyword"
                class="absolute right-2 text-zinc-500 hover:text-zinc-200 p-0.5"
                @click="filterKeyword = ''"
              >
                <X class="w-3 h-3" />
              </button>
            </div>

            <button
              v-if="filteredSongs.length"
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

        <!-- 歌曲列表滚动区 -->
        <div class="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
          <div v-if="!currentList?.songs.length" class="py-20 text-center text-zinc-500 text-xs space-y-2">
            <div>歌单暂无歌曲</div>
            <div class="text-[11px] text-zinc-600">去“全网搜索”添加歌曲，或点击右上角导入历史歌单</div>
          </div>

          <div v-else-if="!filteredSongs.length" class="py-20 text-center text-zinc-500 text-xs space-y-2">
            <div>未找到与“{{ filterKeyword }}”匹配的歌曲</div>
            <button class="text-sky-400 hover:underline text-[11px]" @click="filterKeyword = ''">清除搜索</button>
          </div>

          <div
            v-for="(song, idx) in filteredSongs"
            :key="song.id"
            class="h-12 px-4 flex items-center justify-between text-xs transition-colors group cursor-pointer border-b border-white/[0.03] hover:bg-white/[0.04]"
            :class="playerStore.currentMusic?.id === song.id ? 'bg-sky-500/[0.08]' : ''"
            @dblclick="playSelectedSong(song)"
          >
            <!-- 序号与标题 (自适应弹性充满剩余宽度) -->
            <div class="flex items-center gap-3 flex-1 min-w-[200px] overflow-hidden pr-3">
              <div class="w-10 text-center flex-shrink-0 font-mono text-zinc-500 group-hover:text-zinc-300">
                <Volume2
                  v-if="playerStore.currentMusic?.id === song.id"
                  class="w-3.5 h-3.5 text-sky-400 animate-pulse mx-auto"
                />
                <span v-else>{{ (idx + 1).toString().padStart(2, '0') }}</span>
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
                <span
                  class="truncate font-medium transition-colors"
                  :class="playerStore.currentMusic?.id === song.id ? 'text-sky-400 font-semibold' : 'text-zinc-200 group-hover:text-sky-400'"
                  :title="song.name"
                >
                  {{ song.name }}
                </span>
                <span class="px-1.5 py-0.2 rounded bg-white/10 border border-white/20 text-[9px] font-bold text-zinc-200 font-mono scale-90 origin-left flex-shrink-0">
                  SQ
                </span>
              </div>
            </div>

            <!-- 歌手 -->
            <div
              class="w-36 md:w-48 lg:w-60 flex-shrink-0 hidden sm:block text-zinc-400 truncate pr-3 hover:text-zinc-200 transition-colors"
              :title="song.singer"
            >
              {{ song.singer }}
            </div>

            <!-- 专辑 -->
            <div
              class="w-32 lg:w-48 flex-shrink-0 hidden md:block text-zinc-500 truncate pr-3"
              :title="song.album"
            >
              {{ song.album || '单曲' }}
            </div>

            <!-- 时长与操作 -->
            <div class="flex items-center justify-end gap-3 w-28 flex-shrink-0 font-mono text-zinc-400">
              <span class="text-right text-[11px]">{{ song.interval }}</span>

              <div class="flex items-center gap-1.5 w-14 justify-end">
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
                  class="p-1 text-zinc-400 hover:text-sky-400 transition-colors"
                  title="播放"
                  @click.stop="playSelectedSong(song)"
                >
                  <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
                <button
                  v-if="selectedListId !== 'local'"
                  class="p-1 text-zinc-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="从歌单移除"
                  @click.stop="playlistStore.removeSongFromList(selectedListId, song.id)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
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
import {
  Download,
  Plus,
  HardDrive,
  Heart,
  ListMusic,
  Archive,
  Folder,
  FolderSearch,
  Play,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Volume2
} from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'
import { usePlaylistStore } from '@/store/playlist'
import { scanAndImportLegacyData, openFolderPicker, scanLocalMusic } from '@/core/tauriBridge'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2338bdf8"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

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
const isSidebarCollapsed = ref(true)
const filterKeyword = ref('')

const customLists = computed(() => playlistStore.customLists)

const totalSongCount = computed(() => {
  return customLists.value.reduce((acc, l) => acc + (l.songs?.length || 0), 0)
})

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

const filteredSongs = computed(() => {
  const songs = currentList.value?.songs || []
  if (!filterKeyword.value.trim()) return songs
  const kw = filterKeyword.value.trim().toLowerCase()
  return songs.filter((s) =>
    (s.name && s.name.toLowerCase().includes(kw)) ||
    (s.singer && s.singer.toLowerCase().includes(kw)) ||
    (s.album && s.album.toLowerCase().includes(kw))
  )
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
  const list = filteredSongs.value.length ? filteredSongs.value : (currentList.value?.songs || [])
  if (list.length > 0) {
    const idx = list.findIndex((s) => s.id === song.id)
    playerStore.replaceQueue(list, Math.max(0, idx))
  } else {
    playerStore.addToQueue(song, true)
  }
}

async function playCurrentListAll() {
  const list = filteredSongs.value.length ? filteredSongs.value : (currentList.value?.songs || [])
  if (list.length) {
    playerStore.replaceQueue(list)
  }
}
</script>

