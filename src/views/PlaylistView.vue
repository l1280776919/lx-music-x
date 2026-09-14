<template>
  <div class="h-full flex flex-col p-6 space-y-6 max-w-6xl mx-auto overflow-hidden">
    <!-- 顶部标题与快速操作 -->
    <header class="flex items-center justify-between flex-shrink-0">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">我的歌单</h1>
        <p class="text-sm text-zinc-500 mt-1">本地曲库超高速检索 · 原版历史数据无缝迁移</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold border border-blue-500/30 transition active:scale-95"
          @click="handleImportLegacy"
        >
          <Download class="w-3.5 h-3.5" />
          <span>{{ importStatusText }}</span>
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition active:scale-95"
          @click="createPlaylist"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>新建歌单</span>
        </button>
      </div>
    </header>

    <!-- 主体分栏: 左侧歌单选择 + 右侧歌单曲目 -->
    <div class="flex-1 flex gap-6 overflow-hidden">
      <!-- 左侧: 歌单导航栏 -->
      <aside class="w-64 flex flex-col gap-2 overflow-y-auto pr-1">
        <div
          v-for="list in customLists"
          :key="list.id"
          class="flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer group"
          :class="selectedListId === list.id
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
            : 'bg-white/60 dark:bg-zinc-900/60 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'"
          @click="selectedListId = list.id"
        >
          <div class="flex items-center gap-3 truncate">
            <component :is="getPlaylistIcon(list.id)" class="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div class="truncate">
              <div class="text-sm truncate">{{ list.name }}</div>
              <div class="text-[11px] text-zinc-400 font-normal">{{ list.songs.length }} 首歌曲</div>
            </div>
          </div>
          <span v-if="selectedListId === list.id" class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </aside>

      <!-- 右侧: 当前歌单内歌曲列表 -->
      <main class="flex-1 flex flex-col bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm">
        <!-- 歌单头部信息 -->
        <div class="p-6 border-b border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between flex-shrink-0">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">{{ currentList?.name }}</h2>
              <span v-if="selectedListId === 'local'" class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
                原生极速扫描
              </span>
            </div>
            <div class="text-xs text-zinc-400 mt-1">共 {{ currentList?.songs.length || 0 }} 首音乐</div>
          </div>
          <div class="flex items-center gap-3">
            <button
              v-if="selectedListId === 'local'"
              class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold shadow-md transition active:scale-95 border border-zinc-700/50"
              @click="handleScanLocalMusic"
            >
              <FolderSearch class="w-3.5 h-3.5" />
              <span>扫描本地目录</span>
            </button>
            <button
              v-if="currentList?.songs.length"
              class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition active:scale-95"
              @click="playCurrentListAll"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span>播放此歌单</span>
            </button>
          </div>
        </div>

        <!-- 歌曲列表滚动区 -->
        <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
          <div v-if="!currentList?.songs.length" class="py-24 text-center text-zinc-400 text-sm">
            歌单暂无歌曲，去搜索页或点击右上角导入历史歌单吧
          </div>

          <div
            v-for="(song, idx) in currentList?.songs"
            :key="song.id"
            class="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition group cursor-pointer"
            @dblclick="playSelectedSong(song)"
          >
            <div class="flex items-center gap-4 min-w-[240px] max-w-[50%]">
              <span class="w-6 text-center text-xs text-zinc-400 font-mono group-hover:text-emerald-500">{{ idx + 1 }}</span>
              <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 relative">
                <img
                  :src="song.pic || defaultCover"
                  alt="cover"
                  referrerpolicy="no-referrer"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
              </div>
              <div class="overflow-hidden">
                <div class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition truncate">
                  {{ song.name }}
                </div>
                <div class="text-xs text-zinc-400 mt-0.5 truncate">{{ song.singer }}</div>
              </div>
            </div>

            <div class="hidden md:block text-xs text-zinc-400 truncate max-w-xs">
              {{ song.album || '本地音乐' }}
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

              <span class="text-xs text-zinc-400 font-mono w-12 text-right">{{ song.interval || '03:45' }}</span>

              <button
                class="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-500 hover:text-white text-zinc-600 dark:text-zinc-300 transition active:scale-95"
                @click.stop="playSelectedSong(song)"
              >
                <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, Plus, HardDrive, Heart, ListMusic, Archive, Folder, FolderSearch, Play } from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'
import { scanAndImportLegacyData, openFolderPicker, scanLocalMusic, convertLocalAudioSrc } from '@/core/tauriBridge'

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2310b981"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

interface PlaylistGroup {
  id: string
  name: string
  songs: MusicItem[]
}

const playerStore = usePlayerStore()
const selectedListId = ref('fav')
const importStatusText = ref('一键迁移原版歌单')

const customLists = ref<PlaylistGroup[]>([
  {
    id: 'local',
    name: '本地音乐',
    songs: [],
  },
  {
    id: 'fav',
    name: '我喜欢的音乐',
    songs: [
      { id: 'fav-1', name: '海阔天空', singer: 'Beyond', album: '海阔天空', interval: '05:24', url: 'https://music.163.com/song/media/outer/url?id=347230.mp3' },
      { id: 'fav-2', name: '光辉岁月', singer: 'Beyond', album: '命运派对', interval: '05:03', url: 'https://music.163.com/song/media/outer/url?id=346576.mp3' },
    ],
  },
  {
    id: 'default',
    name: '默认试听列表',
    songs: [
      { id: 'def-1', name: '晴天', singer: '周杰伦', album: '叶惠美', interval: '04:29', url: 'https://music.163.com/song/media/outer/url?id=186016.mp3' },
      { id: 'def-2', name: '起风了', singer: '买辣椒也用券', album: '起风了', interval: '05:25', url: 'https://music.163.com/song/media/outer/url?id=1330348068.mp3' },
    ],
  },
])

function getPlaylistIcon(id: string) {
  if (id === 'local') return HardDrive
  if (id === 'fav') return Heart
  if (id === 'default') return ListMusic
  if (id.startsWith('legacy') || id.startsWith('imported')) return Archive
  return Folder
}

const currentList = computed(() => {
  return customLists.value.find(l => l.id === selectedListId.value) || customLists.value[0]
})

onMounted(async () => {
  // 读取已保存的本地音乐缓存
  try {
    const savedLocal = localStorage.getItem('lx_local_songs')
    if (savedLocal) {
      const localGroup = customLists.value.find(l => l.id === 'local')
      if (localGroup) {
        localGroup.songs = JSON.parse(savedLocal)
      }
    }
  } catch {
    //
  }

  // 静默预检测原版数据库
  const res = await scanAndImportLegacyData()
  if (res.found && res.playlists.length > 0) {
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
    const mapped: MusicItem[] = tracks.map(t => ({
      id: t.id,
      name: t.name,
      singer: t.singer,
      album: t.album,
      interval: `${(t.size / (1024 * 1024)).toFixed(1)}MB`,
      source: 'local',
      path: t.path,
      url: convertLocalAudioSrc(t.path),
    }))

    const localGroup = customLists.value.find(l => l.id === 'local')
    if (localGroup) {
      localGroup.songs = mapped
      localStorage.setItem('lx_local_songs', JSON.stringify(mapped))
    }
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
      for (const p of res.playlists) {
        const exists = customLists.value.find(l => l.name === p.name)
        if (!exists) {
          customLists.value.push({
            id: p.id,
            name: p.name,
            songs: p.songs.map(s => ({
              id: s.id,
              name: s.name,
              singer: s.singer,
              interval: s.interval,
              album: '历史导入',
            })),
          })
        }
      }
      importStatusText.value = `✓ 导入成功 (${res.total_songs}首)`
    } else {
      importStatusText.value = '未发现原版数据'
      alert('未在默认目录下找到原版 lx-music-desktop 历史数据文件。')
    }
  } catch (err: any) {
    alert(`导入出错: ${err}`)
    importStatusText.value = '导入失败'
  }
}

function createPlaylist() {
  const name = prompt('请输入新歌单名称:')
  if (name && name.trim()) {
    const newList: PlaylistGroup = {
      id: `list-${Date.now()}`,
      name: name.trim(),
      songs: [],
    }
    customLists.value.push(newList)
    selectedListId.value = newList.id
  }
}

async function playSelectedSong(song: MusicItem) {
  await playerStore.playMusic(song)
}

async function playCurrentListAll() {
  if (currentList.value?.songs.length) {
    playerStore.playlist = [...currentList.value.songs]
    playerStore.currentIndex = 0
    await playerStore.playMusic(currentList.value.songs[0])
  }
}
</script>
