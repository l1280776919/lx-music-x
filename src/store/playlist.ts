import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { MusicItem } from './player'
import type { ImportedPlaylist } from '@/core/tauriBridge'
import { backendState, backendCommand, sendCommand } from '@/core/backend'

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
    setLocalSongs: (songs: MusicItem[]) => edit('local', { listId: 'local', songs }),
    importLegacyPlaylists: (playlists: ImportedPlaylist[]) => edit('import', { playlists }),
  }
})
