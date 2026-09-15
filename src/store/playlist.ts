import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { MusicItem } from './player'
import type { ImportedPlaylist } from '@/core/tauriBridge'
import { backendState, backendCommand, sendCommand } from '@/core/backend'

import { isTauri, downloadSongs as downloadSongsBridge } from '@/core/tauriBridge'

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
    batchFavorite: (songs: MusicItem[]) => sendCommand('library', { action: 'batch_favorite', data: { songs } }),
    createPlaylist: (name: string) => edit<PlaylistGroup>('create', { name }),
    createPlaylistWithSongs: (name: string, songs: MusicItem[]) => edit<PlaylistGroup>('create_with_songs', { name, songs }),
    removePlaylist: (listId: string) => edit('delete', { listId }),
    renamePlaylist: (listId: string, name: string) => edit('rename', { listId, name }),
    addSongToList: (listId: string, song: MusicItem) => edit('add', { listId, song }),
    removeSongFromList: (listId: string, songId: string) => edit('remove', { listId, songId }),
    batchAddSongs: (listId: string, songs: MusicItem[]) => edit('batch_add', { listId, songs }),
    batchRemoveSongs: (listId: string, songIds: string[]) => edit('batch_remove', { listId, songIds }),
    reorderSong: (listId: string, from: number, to: number) => edit('reorder', { listId, from, to }),
    replaceSongs: (listId: string, songs: MusicItem[]) => edit('replace_songs', { listId, songs }),
    clearPlaylist: (listId: string) => edit('clear', { listId }),
    setLocalSongs: (songs: MusicItem[]) => edit('local', { listId: 'local', songs }),
    importLegacyPlaylists: (playlists: ImportedPlaylist[]) => edit('import', { playlists }),
    downloadSongs: async (songs: MusicItem[]) => {
      if (!isTauri()) throw new Error('网页预览环境不支持本地文件下载')
      return await downloadSongsBridge(songs)
    },
    downloadSong: async (song: MusicItem) => {
      if (!isTauri()) throw new Error('网页预览环境不支持本地文件下载')
      const tasks = await downloadSongsBridge([song])
      return tasks[0]?.filePath || song.name
    },
  }
})
