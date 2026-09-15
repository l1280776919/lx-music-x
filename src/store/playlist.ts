import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { MusicItem } from './player'
import type { ImportedPlaylist } from '@/core/tauriBridge'
import { backendState, backendCommand, sendCommand } from '@/core/backend'

import { invoke } from '@tauri-apps/api/core'
import { isTauri } from '@/core/tauriBridge'

export interface PlaylistGroup {
  id: string; name: string; songs: MusicItem[]; isCustom?: boolean; description?: string; cover?: string;
}
export const usePlaylistStore = defineStore('playlist', () => {
  const customLists = computed(() => backendState.library.playlists)
  const favoriteIds = computed(() => new Set(customLists.value.find(l => l.id === 'fav')?.songs.map(s => s.id) || []))
  const edit = <T = any>(action: string, data: any) => backendCommand<T>('library', { action, data })
  return {
    customLists, favoriteIds,
    isFavorite: (id: string) => favoriteIds.value.has(id),
    toggleFavorite: (song: MusicItem) => sendCommand('library', { action: 'favorite', data: { song } }),
    createPlaylist: (name: string) => edit<PlaylistGroup>('create', { name }),
    removePlaylist: (listId: string) => edit('delete', { listId }),
    renamePlaylist: (listId: string, name: string) => edit('rename', { listId, name }),
    addSongToList: (listId: string, song: MusicItem) => edit('add', { listId, song }),
    removeSongFromList: (listId: string, songId: string) => edit('remove', { listId, songId }),
    batchAddSongs: (listId: string, songs: MusicItem[]) => edit('batch_add', { listId, songs }),
    batchRemoveSongs: (listId: string, songIds: string[]) => edit('batch_remove', { listId, songIds }),
    reorderSong: (listId: string, from: number, to: number) => edit('reorder', { listId, from, to }),
    replaceSongs: (listId: string, songs: MusicItem[]) => edit('replace_songs', { listId, songs }),
    setLocalSongs: (songs: MusicItem[]) => edit('local', { listId: 'local', songs }),
    importLegacyPlaylists: (playlists: ImportedPlaylist[]) => edit('import', { playlists }),
    downloadSong: async (song: MusicItem) => {
      if (!isTauri()) throw new Error('网页预览环境不支持本地文件下载')
      const filePath = await invoke<string>('download_online_song', { song })
      const localItem: MusicItem = {
        id: `local_${filePath}`,
        name: song.name,
        singer: song.singer,
        album: song.album || '本地下载',
        path: filePath,
        source: 'local',
        pic: song.pic,
        lrc: song.lrc,
      }
      await edit('add', { listId: 'local', song: localItem })
      return filePath
    },
  }
})
