import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { reactive, ref } from 'vue'
import type { MusicItem } from '@/store/player'
import type { PlaylistGroup } from '@/store/playlist'
import { isTauri } from './tauriBridge'

export const backendError = ref('')
export const backendState = reactive({
  revision: -1,
  library: {
    playlists: [] as PlaylistGroup[], queue: [] as MusicItem[], currentIndex: 0,
    volume: 0.8, muted: false, mode: 'list', eq: Array(10).fill(0) as number[],
    script: null as any, migrated: false,
  },
  playback: {
    isPlaying: false, currentTime: 0, duration: 0, loading: false, error: null as string | null,
    currentLineIndex: -1, currentLineText: '', currentTransText: '', nextLineText: '',
  },
  lyricLines: [] as string[],
  lyricEntries: [] as { time: number; text: string; trans?: string }[],
})

function apply(snapshot: any) {
  if (!snapshot || snapshot.revision < backendState.revision) return
  Object.assign(backendState, snapshot)
}
let ready: Promise<void> | undefined
export function initializeBackend() {
  if (ready) return ready
  ready = (async () => {
    if (!isTauri()) { backendError.value = '请通过 Tauri 桌面端运行，网页预览仅显示界面。'; return }
    await listen('core-state', event => apply(event.payload))
    await listen('core-playback', event => Object.assign(backendState.playback, event.payload))
    apply(await invoke('core_command', { action: 'snapshot' }))
    // One-time transfer only: subsequent persistence and mutations live in Rust.
    if (!backendState.library.migrated && !location.pathname.includes('desktop-lyric')) {
      const read = (key: string) => {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : null
      }
      await invoke('core_command', { action: 'library', data: { action: 'migrate', data: {
        playlists: read('lx_custom_playlists_v2'), queue: read('lx_player_queue'), localSongs: read('lx_local_songs'),
      } } })
      const code = localStorage.getItem('lx_user_api_code')
      if (code && !backendState.library.script) {
        try { await invoke('user_api_command', { action: 'code', data: { code, url: localStorage.getItem('lx_user_api_url') } }) }
        catch (e) { backendError.value = `旧音源导入失败，原代码仍保留：${e}` }
      }
      apply(await invoke('core_command', { action: 'snapshot' }))
    }
  })().catch(e => { backendError.value = String(e); throw e })
  return ready
}

export async function backendCommand<T = any>(action: string, data: any = null): Promise<T> {
  await initializeBackend()
  if (!isTauri()) throw new Error(backendError.value)
  try {
    const result = await invoke<T>('core_command', { action, data })
    apply(await invoke('core_command', { action: 'snapshot' }))
    backendError.value = ''
    return result
  } catch (error) { backendError.value = String(error); throw error }
}
export function sendCommand(action: string, data: any = null) {
  void backendCommand(action, data).catch(() => {})
}
