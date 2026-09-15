import { invoke, convertFileSrc } from '@tauri-apps/api/core'
import { emit, listen, UnlistenFn } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/plugin-dialog'

/**
 * 是否在 Tauri 客户端环境中运行
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

/**
 * 切换桌面悬浮歌词窗口显示/隐藏
 */
export async function toggleDesktopLyricWindow(visible: boolean): Promise<void> {
  if (!isTauri()) {
    console.log('[TauriBridge Mock] toggleDesktopLyricWindow:', visible)
    return
  }
  try {
    await invoke('toggle_desktop_lyric', { visible })
  } catch (err) {
    console.error('Failed to toggle desktop lyric:', err)
  }
}

/**
 * 设置桌面悬浮歌词鼠标穿透
 */
export async function setDesktopLyricIgnoreMouse(ignore: boolean): Promise<void> {
  if (!isTauri()) {
    console.log('[TauriBridge Mock] setDesktopLyricIgnoreMouse:', ignore)
    return
  }
  try {
    await invoke('set_lyric_ignore_mouse', { ignore })
  } catch (err) {
    console.error('Failed to set lyric ignore mouse:', err)
  }
}

/**
 * 切换或设置桌面歌词穿透锁定状态（Rust 后端单例驱动）
 */
export async function toggleDesktopLyricLock(locked?: boolean): Promise<boolean> {
  if (!isTauri()) {
    return false
  }
  try {
    return await invoke<boolean>('toggle_desktop_lyric_lock', { locked })
  } catch (err) {
    console.error('Failed to toggle desktop lyric lock:', err)
    return false
  }
}

/**
 * 获取当前桌面歌词是否处于锁定鼠标穿透状态
 */
export async function getDesktopLyricLocked(): Promise<boolean> {
  if (!isTauri()) {
    return false
  }
  try {
    return await invoke<boolean>('get_desktop_lyric_locked')
  } catch (err) {
    console.error('Failed to get desktop lyric locked state:', err)
    return false
  }
}

/**
 * 获取系统与架构信息
 */
export async function getSystemInfo(): Promise<{
  app_name: string
  version: string
  tauri_version: string
  arch: string
  os: string
} | null> {
  if (!isTauri()) {
    return {
      app_name: 'LX Music X (Web Mock)',
      version: '0.1.0',
      tauri_version: '2.x',
      arch: 'x64',
      os: 'windows',
    }
  }
  try {
    return await invoke('get_system_info')
  } catch (err) {
    console.error('Failed to get system info:', err)
    return null
  }
}

export interface ImportedSong {
  id: string
  list_id: string
  name: string
  singer: string
  source: string
  interval: string
}

export interface ImportedPlaylist {
  id: string
  name: string
  songs: ImportedSong[]
}

export interface ImportResult {
  found: boolean
  db_path: string
  playlists: ImportedPlaylist[]
  total_songs: number
  user_api_count: number
}

/**
 * 扫描并一键导入原版 lx-music-desktop 的历史数据库与歌单
 */
export async function scanAndImportLegacyData(): Promise<ImportResult> {
  if (!isTauri()) {
    return {
      found: false,
      db_path: 'Web Mock',
      playlists: [],
      total_songs: 0,
      user_api_count: 0,
    }
  }
  return await invoke('scan_and_import_legacy_data')
}

export interface LyricSyncPayload {
  currentLine: string
  currentTrans?: string
  nextLine: string
  isPlaying: boolean
  songName: string
  singer: string
}

/**
 * 主窗口向歌词窗口广播歌词同步事件
 */
export async function broadcastLyricSync(payload: LyricSyncPayload): Promise<void> {
  if (!isTauri()) return
  try {
    await emit('lyric-sync', payload)
  } catch (err) {
    console.error('Failed to broadcast lyric sync:', err)
  }
}

/**
 * 歌词窗口监听主窗口广播的歌词数据
 */
export async function listenLyricSync(callback: (payload: LyricSyncPayload) => void): Promise<UnlistenFn | undefined> {
  if (!isTauri()) return undefined
  try {
    return await listen<LyricSyncPayload>('lyric-sync', (event) => {
      callback(event.payload)
    })
  } catch (err) {
    console.error('Failed to listen lyric sync:', err)
    return undefined
  }
}

/**
 * 歌词窗口向主窗口发送播放控制指令
 */
export async function emitPlayerControl(action: 'toggle-play' | 'prev' | 'next'): Promise<void> {
  if (!isTauri()) return
  try {
    await invoke('core_command', { action: action === 'toggle-play' ? 'toggle' : action })
  } catch (err) {
    console.error('Failed to emit player control:', err)
  }
}

/**
 * 主窗口监听歌词窗口与托盘发来的控制指令
 */
export async function listenRemoteControls(handlers: {
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
}): Promise<UnlistenFn[]> {
  if (!isTauri()) return []

  const unlistens: UnlistenFn[] = []
  try {
    // 监听歌词窗口的控制
    const unlistenLyric = await listen<string>('player-remote-control', (e) => {
      if (e.payload === 'toggle-play') handlers.onTogglePlay()
      else if (e.payload === 'prev') handlers.onPrev()
      else if (e.payload === 'next') handlers.onNext()
    })
    unlistens.push(unlistenLyric)

    // 监听托盘控制
    const unlistenTrayPlay = await listen('tray-toggle-play', () => handlers.onTogglePlay())
    const unlistenTrayPrev = await listen('tray-prev-track', () => handlers.onPrev())
    const unlistenTrayNext = await listen('tray-next-track', () => handlers.onNext())
    unlistens.push(unlistenTrayPlay, unlistenTrayPrev, unlistenTrayNext)
  } catch (err) {
    console.error('Failed to listen remote controls:', err)
  }

  return unlistens
}

export interface LocalTrackItem {
  id: string
  name: string
  singer: string
  album: string
  path: string
  ext: string
  size: number
  source: string
  interval: string
}

/**
 * 弹出原生系统文件夹选择框
 */
export async function openFolderPicker(): Promise<string | null> {
  if (!isTauri()) return null
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: '选择包含音频文件的本地文件夹',
    })
    return selected as string | null
  } catch (err) {
    console.error('Folder picker error:', err)
    return null
  }
}

/**
 * 原生 Rust 快速递归扫描本地音乐
 */
export async function scanLocalMusic(dirPath: string): Promise<LocalTrackItem[]> {
  if (!isTauri()) {
    return []
  }
  try {
    return await invoke<LocalTrackItem[]>('scan_local_directory', { dirPath })
  } catch (err) {
    console.error('Failed to scan local directory:', err)
    throw err
  }
}

/**
 * 原生 Rust 快速递归扫描本地音乐并由后端直接原子入库
 */
export async function scanAndImportLocalDirectory(dirPath: string): Promise<LocalTrackItem[]> {
  if (!isTauri()) {
    return []
  }
  try {
    return await invoke<LocalTrackItem[]>('scan_and_import_local_directory', { dirPath })
  } catch (err) {
    console.error('Failed to scan and import local directory:', err)
    throw err
  }
}

export interface DownloadTaskItem {
  id: string
  songId: string
  name: string
  singer: string
  album: string
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'skipped'
  progress: number
  error?: string | null
  filePath?: string | null
}

/**
 * 批量提交歌曲下载任务（Rust 后端自动处理排队、下载与入库）
 */
export async function downloadSongs(songs: any[]): Promise<DownloadTaskItem[]> {
  if (!isTauri()) {
    return []
  }
  try {
    return await invoke<DownloadTaskItem[]>('download_songs', { songs })
  } catch (err) {
    console.error('Failed to submit download tasks:', err)
    throw err
  }
}

/**
 * 获取后端下载任务列表
 */
export async function getDownloadTasks(): Promise<DownloadTaskItem[]> {
  if (!isTauri()) {
    return []
  }
  try {
    return await invoke<DownloadTaskItem[]>('get_download_tasks')
  } catch (err) {
    console.error('Failed to get download tasks:', err)
    return []
  }
}

/**
 * 从后端 SQLite 获取持久化配置
 */
export async function getAppSettings(): Promise<Record<string, any>> {
  if (!isTauri()) {
    return {}
  }
  try {
    return await invoke<Record<string, any>>('get_app_settings')
  } catch (err) {
    console.error('Failed to get app settings:', err)
    return {}
  }
}

/**
 * 持久化配置至后端 SQLite，并广播同步
 */
export async function saveAppSetting(key: string, value: any): Promise<void> {
  if (!isTauri()) {
    return
  }
  try {
    await invoke('save_app_setting', { key, value })
  } catch (err) {
    console.error('Failed to save app setting:', err)
  }
}

/**
 * 将本地文件绝对路径转换为 Tauri asset 安全播放协议 URL
 */
export function convertLocalAudioSrc(filePath: string): string {
  if (!isTauri()) return filePath
  return convertFileSrc(filePath)
}

export interface WebdavConfig {
  endpoint: string
  username: string
  password: string
  remotePath?: string
}

export interface SyncResult {
  success: boolean
  strategy: string
  timestamp: number
  playlistCount: number
  songCount: number
  message: string
}

/**
 * 测试 WebDAV 账户与服务器连接状态
 */
export async function testWebdavConnection(config: WebdavConfig): Promise<boolean> {
  if (!isTauri()) return true
  return await invoke<boolean>('test_webdav_connection', { config })
}

/**
 * 获取持久化的 WebDAV 配置
 */
export async function getWebdavConfig(): Promise<WebdavConfig | null> {
  if (!isTauri()) return null
  return await invoke<WebdavConfig | null>('get_webdav_config')
}

/**
 * 保存 WebDAV 配置
 */
export async function saveWebdavConfig(config: WebdavConfig): Promise<void> {
  if (!isTauri()) return
  await invoke('save_webdav_config', { config })
}

/**
 * 执行 WebDAV 元数据同步（智能合并、上传覆盖、下载恢复）
 */
export async function syncWebdavData(
  config: WebdavConfig,
  strategy: 'smart' | 'upload_overwrite' | 'download_overwrite' | 'merge'
): Promise<SyncResult> {
  if (!isTauri()) {
    return {
      success: true,
      strategy,
      timestamp: Date.now(),
      playlistCount: 0,
      songCount: 0,
      message: 'Web 演示模式无实际同步',
    }
  }
  return await invoke<SyncResult>('sync_webdav_data', { config, strategy })
}


