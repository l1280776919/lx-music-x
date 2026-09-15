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
          title="解析网易云音乐、QQ音乐歌单分享链接"
          @click="isImportOnlineModalOpen = true"
        >
          <Link2 class="w-3.5 h-3.5 text-sky-400" />
          <span>导入在线歌单</span>
        </button>
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
              v-if="selectedListId === 'history' && filteredSongs.length"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/10 text-xs font-medium transition cursor-pointer"
              title="清空最近播放历史"
              @click="handleClearHistory"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>清空历史</span>
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

        <!-- 列表表头 (支持全选/反选) -->
        <div class="h-9 px-4 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between flex-shrink-0 select-none">
          <div class="flex items-center gap-2 flex-1 min-w-[200px] overflow-hidden">
            <!-- 全选 Checkbox (深色自适应极简风格) -->
            <div class="w-6 flex items-center justify-center flex-shrink-0">
              <div
                class="w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer"
                :class="[
                  isAllSelected
                    ? 'bg-sky-500 border-sky-400 text-white shadow-sm shadow-sky-500/40'
                    : selectedSongIds.size > 0
                      ? 'bg-sky-500/20 border-sky-400 text-sky-400'
                      : 'border-white/30 bg-black/40 hover:border-sky-400/80 hover:bg-white/10'
                ]"
                title="全选 / 取消全选"
                @click="toggleSelectAll"
              >
                <Check v-if="isAllSelected" class="w-2.5 h-2.5 stroke-[3]" />
                <Minus v-else-if="selectedSongIds.size > 0" class="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
            <span class="w-7 text-center flex-shrink-0 font-mono text-[11px]">#</span>
            <span class="flex-1">歌曲标题</span>
          </div>
          <div class="w-36 md:w-48 lg:w-60 flex-shrink-0 hidden sm:block truncate pr-3">歌手</div>
          <div class="w-32 lg:w-48 flex-shrink-0 hidden md:block truncate pr-3">专辑</div>
          <div class="flex items-center justify-end gap-3 w-32 flex-shrink-0">
            <span class="text-right">时长</span>
            <span class="w-20 text-center">操作</span>
          </div>
        </div>

        <!-- 歌曲列表滚动区 (支持拖拽重排与批量选中) -->
        <div class="flex-1 overflow-y-auto divide-y divide-white/[0.03] relative">
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
            :draggable="!filterKeyword && selectedListId !== 'local'"
            class="h-12 px-4 flex items-center justify-between text-xs transition-colors group cursor-pointer border-b border-white/[0.03] select-none"
            :class="[
              playerStore.currentMusic?.id === song.id ? 'bg-sky-500/[0.08]' : 'hover:bg-white/[0.04]',
              selectedSongIds.has(song.id) ? 'bg-sky-500/[0.12]' : '',
              dragOverIndex === idx ? 'border-t-2 !border-t-sky-400 bg-sky-500/10' : '',
              draggedIndex === idx ? 'opacity-30' : ''
            ]"
            @dragstart="onDragStart(idx, $event)"
            @dragover.prevent="onDragOver(idx)"
            @dragleave="onDragLeave(idx)"
            @drop.prevent="onDrop(idx)"
            @dragend="onDragEnd"
            @dblclick="playSelectedSong(song)"
          >
            <!-- 多选框 + 序号与标题 -->
            <div class="flex items-center gap-2 flex-1 min-w-[200px] overflow-hidden pr-3">
              <div class="w-6 flex items-center justify-center flex-shrink-0" @click.stop>
                <div
                  class="w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer"
                  :class="[
                    selectedSongIds.has(song.id)
                      ? 'bg-sky-500 border-sky-400 text-white shadow-sm shadow-sky-500/40 opacity-100'
                      : selectedSongIds.size > 0
                        ? 'border-white/25 bg-black/40 hover:border-sky-400/80 opacity-100'
                        : 'border-white/25 bg-black/40 hover:border-sky-400/80 opacity-0 group-hover:opacity-100'
                  ]"
                  @click.stop="toggleSelectSong(song.id)"
                >
                  <Check v-if="selectedSongIds.has(song.id)" class="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              <div class="w-7 text-center flex-shrink-0 font-mono text-zinc-500 group-hover:text-zinc-300">
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

            <!-- 时长与操作 (包含喜欢、下载、播放、移除) -->
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

                <!-- 离线下载按钮 -->
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
                  @click.stop="playSelectedSong(song)"
                >
                  <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>

                <button
                  v-if="selectedListId !== 'local'"
                  class="p-1 text-zinc-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="从歌单移除"
                  @click.stop="playlistStore.removeSongFromList(selectedListId, song.id)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 悬浮批量操作工具栏 (当选中歌曲时弹出) -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div
            v-if="selectedSongIds.size > 0"
            class="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-2xl bg-[#181920]/95 backdrop-blur-2xl border border-sky-400/40 shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center gap-2.5 select-none"
          >
            <div class="flex items-center gap-2 pr-3 border-r border-white/10 text-xs font-semibold text-white">
              <CheckSquare class="w-4 h-4 text-sky-400" />
              <span>已选 {{ selectedSongIds.size }} 首</span>
            </div>

            <button
              class="desktop-btn-primary !h-7 !px-2.5 !text-[11px]"
              title="立即播放选中的所有歌曲"
              @click="playSelectedBatch"
            >
              <Play class="w-3 h-3 fill-current" />
              <span>播放</span>
            </button>

            <button
              class="desktop-btn-secondary !h-7 !px-2.5 !text-[11px]"
              title="加到当前播放队列"
              @click="addSelectedBatchToQueue"
            >
              <ListPlus class="w-3 h-3" />
              <span>入队</span>
            </button>

            <button
              class="desktop-btn-secondary !h-7 !px-2.5 !text-[11px]"
              title="批量加入我喜欢的音乐"
              @click="favoriteSelectedBatch"
            >
              <Heart class="w-3 h-3 text-rose-400" />
              <span>收藏</span>
            </button>

            <button
              class="desktop-btn-secondary !h-7 !px-2.5 !text-[11px]"
              title="批量下载到本地"
              :disabled="isBatchDownloading"
              @click="downloadSelectedBatch"
            >
              <Loader2 v-if="isBatchDownloading" class="w-3 h-3 animate-spin text-sky-400" />
              <Download v-else class="w-3 h-3 text-sky-400" />
              <span>{{ isBatchDownloading ? '下载中...' : '批量下载' }}</span>
            </button>

            <button
              v-if="selectedListId !== 'local'"
              class="desktop-btn-secondary !h-7 !px-2.5 !text-[11px] hover:!text-rose-400 hover:!border-rose-500/30"
              title="从当前歌单移除已选歌曲"
              @click="removeSelectedBatchFromList"
            >
              <Trash2 class="w-3 h-3" />
              <span>移除</span>
            </button>

            <button
              class="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 ml-1 transition-colors cursor-pointer"
              title="取消选择"
              @click="selectedSongIds.clear()"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </transition>
      </main>
    </div>

    <!-- 在线歌单解析与导入弹窗 -->
    <ImportPlaylistModal v-model="isImportOnlineModalOpen" @imported="handleOnlinePlaylistImported" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Download,
  Plus,
  HardDrive,
  Heart,
  History,
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
  Volume2,
  CheckSquare,
  ListPlus,
  CheckCircle2,
  Loader2,
  Link2,
  Check,
  Minus
} from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'
import { usePlaylistStore } from '@/store/playlist'
import { scanAndImportLegacyData, openFolderPicker, scanAndImportLocalDirectory } from '@/core/tauriBridge'
import ImportPlaylistModal from '@/components/ImportPlaylistModal.vue'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2338bdf8"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

const route = useRoute()
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()
const selectedListId = ref('fav')
const importStatusText = ref('一键迁移原版歌单')
const isSidebarCollapsed = ref(true)
const isImportOnlineModalOpen = ref(false)
const filterKeyword = ref('')

watch(
  () => route.query.id,
  (newId) => {
    if (newId && typeof newId === 'string') {
      selectedListId.value = newId
    }
  },
  { immediate: true }
)

function handleOnlinePlaylistImported(id: string) {
  selectedListId.value = id
}

async function handleClearHistory() {
  if (confirm('确定要清空全部最近播放记录吗？')) {
    await playlistStore.clearPlaylist('history')
    selectedSongIds.value.clear()
  }
}

const customLists = computed(() => playlistStore.customLists)

const totalSongCount = computed(() => {
  return customLists.value.reduce((acc, l) => acc + (l.songs?.length || 0), 0)
})

function getPlaylistIcon(id: string) {
  if (id === 'local') return HardDrive
  if (id === 'fav') return Heart
  if (id === 'history') return History
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
    const tracks = await scanAndImportLocalDirectory(dir)
    if (!tracks || tracks.length === 0) {
      alert('所选目录中未发现音频文件 (支持 .mp3/.flac/.wav/.m4a/.ogg 等)')
      return
    }
    selectedListId.value = 'local'
    alert(`成功扫描并自动导入 ${tracks.length} 首本地歌曲！`)
  } catch (err: any) {
    alert(`扫描本地音乐失败: ${err?.message || err}`)
  }
}

async function handleImportLegacy() {
  importStatusText.value = '正在扫描并导入...'
  try {
    const res = await scanAndImportLegacyData()
    if (res.found) {
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

// 批量多选状态与逻辑
const selectedSongIds = ref<Set<string>>(new Set())
const isBatchDownloading = ref(false)
const downloadingSongIds = ref<Set<string>>(new Set())
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const isAllSelected = computed(() => {
  if (!filteredSongs.value.length) return false
  return filteredSongs.value.every((s) => selectedSongIds.value.has(s.id))
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedSongIds.value.clear()
  } else {
    filteredSongs.value.forEach((s) => selectedSongIds.value.add(s.id))
  }
}

function toggleSelectSong(id: string) {
  if (selectedSongIds.value.has(id)) {
    selectedSongIds.value.delete(id)
  } else {
    selectedSongIds.value.add(id)
  }
}

const getSelectedSongs = () => {
  return (currentList.value?.songs || []).filter((s) => selectedSongIds.value.has(s.id))
}

function playSelectedBatch() {
  const songs = getSelectedSongs()
  if (songs.length) {
    playerStore.replaceQueue(songs)
  }
}

function addSelectedBatchToQueue() {
  const songs = getSelectedSongs()
  if (songs.length) {
    playerStore.batchAddToQueue(songs)
    alert(`已将 ${songs.length} 首歌曲加入当前播放队列`)
  }
}

async function favoriteSelectedBatch() {
  const songs = getSelectedSongs()
  if (songs.length) {
    await playlistStore.batchFavorite(songs)
  }
  selectedSongIds.value.clear()
}

async function removeSelectedBatchFromList() {
  if (!confirm(`确定从当前歌单移除选中的 ${selectedSongIds.value.size} 首歌曲吗？`)) return
  const ids = Array.from(selectedSongIds.value)
  await playlistStore.batchRemoveSongs(selectedListId.value, ids)
  selectedSongIds.value.clear()
}

function isSongDownloaded(song: MusicItem) {
  return (
    song.source === 'local' ||
    !!song.path ||
    customLists.value.find((l) => l.id === 'local')?.songs.some((s) => s.id === song.id || s.name === song.name)
  )
}

async function handleDownload(song: MusicItem) {
  if (downloadingSongIds.value.has(song.id) || isSongDownloaded(song)) return
  downloadingSongIds.value.add(song.id)
  try {
    await playlistStore.downloadSong(song)
    alert(`《${song.name}》已提交后台下载，完成后将自动存入本地音乐库！`)
  } catch (err: any) {
    alert(`下载失败: ${err?.message || err}`)
  } finally {
    downloadingSongIds.value.delete(song.id)
  }
}

async function downloadSelectedBatch() {
  const songs = getSelectedSongs()
  if (!songs.length || isBatchDownloading.value) return
  isBatchDownloading.value = true
  try {
    await playlistStore.downloadSongs(songs)
    selectedSongIds.value.clear()
    alert(`已将 ${songs.length} 首歌曲加入后台下载队列，完成后自动存入本地音乐库！`)
  } catch (e: any) {
    alert(`批量下载提交失败: ${e?.message || e}`)
  } finally {
    isBatchDownloading.value = false
  }
}

// 歌曲拖拽重排交互
function onDragStart(idx: number, e: DragEvent) {
  draggedIndex.value = idx
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
  }
}

function onDragOver(idx: number) {
  if (draggedIndex.value !== null && draggedIndex.value !== idx) {
    dragOverIndex.value = idx
  }
}

function onDragLeave(idx: number) {
  if (dragOverIndex.value === idx) {
    dragOverIndex.value = null
  }
}

async function onDrop(targetIdx: number) {
  const fromIdx = draggedIndex.value
  if (fromIdx !== null && fromIdx !== targetIdx) {
    await playlistStore.reorderSong(selectedListId.value, fromIdx, targetIdx)
  }
  onDragEnd()
}

function onDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

