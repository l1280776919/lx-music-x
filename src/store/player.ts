import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { backendState as state, sendCommand } from '@/core/backend'
import { usePlaylistStore } from './playlist'

export interface MusicItem {
  id: string; name: string; singer: string; album?: string; interval?: string;
  source?: string; pic?: string; url?: string; lrc?: string; path?: string; raw?: any;
}
export type PlayMode = 'list' | 'single' | 'random'

// Read-only projections of native state. UI sends intent; Rust owns transitions.
export const usePlayerStore = defineStore('player', () => {
  const lists = usePlaylistStore()
  const currentMusic = computed(() => state.library.queue[state.library.currentIndex] || null)
  const isDetailOpen = ref(false)
  const isSoundEffectOpen = ref(false)
  const isQueueOpen = ref(false)
  const isDesktopLyricOpen = ref(false)
  return {
    currentMusic, isDetailOpen, isSoundEffectOpen, isQueueOpen, isDesktopLyricOpen,
    playlist: computed(() => state.library.queue),
    currentIndex: computed(() => state.library.currentIndex),
    volume: computed(() => state.library.volume),
    isMuted: computed(() => state.library.muted),
    playMode: computed(() => state.library.mode as PlayMode),
    isPlaying: computed(() => state.playback.isPlaying),
    currentTime: computed(() => state.playback.currentTime),
    duration: computed(() => state.playback.duration),
    loading: computed(() => state.playback.loading),
    currentLineText: computed(() => state.playback.currentLineText),
    nextLineText: computed(() => state.playback.nextLineText),
    currentLineIndex: computed(() => state.playback.currentLineIndex),
    lyricLines: computed(() => state.lyricLines),
    progressPercent: computed(() => state.playback.duration ? Math.min(100, state.playback.currentTime / state.playback.duration * 100) : 0),
    favoriteIds: computed(() => lists.favoriteIds),
    isFavorite: lists.isFavorite,
    toggleFavorite: (song: MusicItem | string) => {
      if (typeof song !== 'string') { lists.toggleFavorite(song); return }
      const item = state.library.queue.find(s => s.id === song)
      if (item) lists.toggleFavorite(item)
    },
    togglePlay: () => sendCommand('toggle'),
    playMusic: (song: MusicItem) => sendCommand('play', { song }),
    replaceQueue: (songs: MusicItem[], index = 0) => sendCommand('replace', { songs, index }),
    addToQueue: (song: MusicItem, playNow = false) => sendCommand('add', { song, playNow }),
    removeFromQueue: (index: number) => sendCommand('remove', { index }),
    clearQueue: () => sendCommand('clear'),
    cyclePlayMode: () => sendCommand('mode'),
    playNext: () => sendCommand('next'),
    playPrev: () => sendCommand('prev'),
    setVolume: (value: number) => sendCommand('volume', { value }),
    toggleMute: () => sendCommand('mute'),
    seekTime: (time: number) => sendCommand('seek', { time }),
  }
})
