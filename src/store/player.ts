import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { backendState as state, sendCommand } from '@/core/backend'
import { usePlaylistStore } from './playlist'

export interface MusicItem {
  id: string; name: string; singer: string; album?: string; interval?: string;
  source?: string; pic?: string; url?: string; lrc?: string; tlrc?: string; path?: string; raw?: any;
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
  const isSleepTimerOpen = ref(false)
  const sleepTimerRemaining = computed<number | null>(() => {
    const info = (state.playback as any)?.sleepTimer
    return (info && info.mode === 'time' && typeof info.remaining === 'number') ? info.remaining : null
  })
  const sleepTimerMode = computed<'time' | 'track_end' | null>(() => {
    const info = (state.playback as any)?.sleepTimer
    return (info && info.mode) ? info.mode : null
  })

  function cancelSleepTimer() {
    sendCommand('sleep_timer', { mode: 'cancel' })
  }

  function setSleepTimer(minutes: number) {
    sendCommand('sleep_timer', { mode: 'time', minutes })
  }

  function setSleepTimerTrackEnd() {
    sendCommand('sleep_timer', { mode: 'track_end' })
  }

  return {
    currentMusic, isDetailOpen, isSoundEffectOpen, isQueueOpen, isDesktopLyricOpen,
    isSleepTimerOpen, sleepTimerRemaining, sleepTimerMode,
    setSleepTimer, setSleepTimerTrackEnd, cancelSleepTimer,
    playlist: computed(() => state.library.queue),
    currentIndex: computed(() => state.library.currentIndex),
    volume: computed({
      get: () => state.library.volume,
      set: (val: number) => sendCommand('volume', { value: val }),
    }),
    isMuted: computed(() => state.library.muted),
    playMode: computed(() => state.library.mode as PlayMode),
    isPlaying: computed(() => state.playback.isPlaying),
    currentTime: computed(() => state.playback.currentTime),
    duration: computed(() => state.playback.duration),
    loading: computed(() => state.playback.loading),
    currentLineText: computed(() => state.playback.currentLineText),
    currentTransText: computed(() => (state.playback as any).currentTransText || ''),
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
    batchAddToQueue: (songs: MusicItem[]) => sendCommand('batch_add', { songs }),
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
