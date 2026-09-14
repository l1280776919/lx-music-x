import { invoke } from '@tauri-apps/api/core'
import type { MusicItem } from '@/store/player'
import { initializeBackend } from './backend'
export const supportedSources = [
  { id: 'wy', name: '网易云音乐' }, { id: 'kg', name: '酷狗音乐' },
  { id: 'tx', name: 'QQ音乐' }, { id: 'kw', name: '酷我音乐' },
  { id: 'mg', name: '咪咕音乐' }, { id: 'custom', name: '自定义源 (UserAPI)' },
]
async function call<T>(action: string, data: any): Promise<T> {
  await initializeBackend()
  return invoke<T>('online_command', { action, data })
}
export const searchOnlineMusic = (keyword: string, source = 'wy', page = 1, limit = 30) =>
  call<{ list: MusicItem[]; total: number }>('search', { keyword, source, page, limit })
export const getOnlineLeaderboards = (source = 'wy') => call<any[]>('boards', { source })
export const getLeaderboardSongs = (bangId: string, source = 'wy', page = 1) => call<MusicItem[]>('boardSongs', { bangId, source, page })
