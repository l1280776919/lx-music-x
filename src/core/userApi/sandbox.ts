import { invoke } from '@tauri-apps/api/core'
import { initializeBackend } from '../backend'
export interface UserApiScriptMeta {
  id: string; name: string; version: string; author: string; description?: string;
  homepage?: string; rawCode: string; sourceUrl?: string; enabled: boolean;
}
export const DEFAULT_USER_API_URL = 'https://raw.githubusercontent.com/pdone/lx-music-source/main/sixyin/latest.js'
async function call(action: string, data: any = {}) {
  await initializeBackend()
  return invoke<UserApiScriptMeta | null>('user_api_command', { action, data })
}
export const userApiManager = {
  getActiveScript: () => call('get'),
  loadScript: (code: string, url?: string) => call('code', { code, url }) as Promise<UserApiScriptMeta>,
  loadScriptFromUrl: (url: string) => call('url', { url }) as Promise<UserApiScriptMeta>,
  resetToDefault: () => call('reset'),
}
