import musicSdk from '@/utils/musicSdk'
import { userApiManager } from '@/core/userApi/sandbox'
import { MusicItem } from '@/store/player'

export interface SearchSourceOption {
  id: string
  name: string
}

export const supportedSources: SearchSourceOption[] = [
  { id: 'wy', name: '网易云音乐' },
  { id: 'kg', name: '酷狗音乐' },
  { id: 'tx', name: 'QQ音乐' },
  { id: 'kw', name: '酷我音乐' },
  { id: 'mg', name: '咪咕音乐' },
  { id: 'custom', name: '自定义源 (UserAPI)' },
]

/**
 * 在线聚合搜索
 */
export async function searchOnlineMusic(
  keyword: string,
  source: string = 'wy',
  page: number = 1,
  limit: number = 30,
): Promise<{ list: MusicItem[]; total: number }> {
  if (!keyword.trim()) return { list: [], total: 0 }

  // 如果选择自定义音源
  if (source === 'custom') {
    try {
      const customRes = await userApiManager.invokeSource('search', {
        keyword,
        page,
        limit,
      })
      if (customRes && Array.isArray(customRes.list)) {
        return {
          list: customRes.list.map((s: any) => ({
            id: s.id || `custom_${Date.now()}_${Math.random()}`,
            name: s.name,
            singer: s.singer || '群星',
            album: s.album || '单曲',
            interval: s.interval || '03:30',
            pic: s.pic || s.img,
            url: s.url,
            source: 'custom',
          })),
          total: customRes.total || customRes.list.length,
        }
      }
    } catch (err) {
      console.warn('Custom source search failed, fallback to wy:', err)
    }
    source = 'wy'
  }

  // 官方主流音源 SDK 检索
  const sdk = (musicSdk as any)[source]
  if (!sdk || !sdk.musicSearch) {
    throw new Error(`暂不支持音源: ${source}`)
  }

  try {
    const res = await sdk.musicSearch.search(keyword, page, limit)
    const list: MusicItem[] = (res.list || []).map((item: any) => {
      // 提取歌曲直链 (如果有的平台直接带有或者调用第三方试听)
      let defaultUrl = ''
      if (item.songmid) {
        if (source === 'wy') {
          defaultUrl = `https://music.163.com/song/media/outer/url?id=${item.songmid}.mp3`
        }
      }

      return {
        id: `${source}_${item.songmid || item.hash || item.id}`,
        name: item.name || '未知曲目',
        singer: item.singer || '未知歌手',
        album: item.albumName || item.album || '精选单曲',
        interval: item.interval || '04:00',
        pic: item.img || item.pic || '',
        url: defaultUrl,
        source,
        raw: item,
      }
    })

    return {
      list,
      total: res.total || list.length,
    }
  } catch (err) {
    console.error(`Search error on source [${source}]:`, err)
    return { list: [], total: 0 }
  }
}

/**
 * 获取官方推荐排行榜榜单列表
 */
export async function getOnlineLeaderboards(source: string = 'wy'): Promise<any[]> {
  const sdk = (musicSdk as any)[source]
  if (!sdk || !sdk.leaderboard) return []
  try {
    const list = await sdk.leaderboard.getBoards()
    return list || []
  } catch (err) {
    console.warn('Get boards failed:', err)
    return []
  }
}

/**
 * 获取排行榜歌曲列表
 */
export async function getLeaderboardSongs(
  bangId: string,
  source: string = 'wy',
  page: number = 1,
): Promise<MusicItem[]> {
  const sdk = (musicSdk as any)[source]
  if (!sdk || !sdk.leaderboard) return []

  try {
    const res = await sdk.leaderboard.getList(bangId, page)
    return (res.list || []).map((item: any) => ({
      id: `${source}_${item.songmid || item.hash || item.id}`,
      name: item.name,
      singer: item.singer,
      album: item.albumName || '热歌榜',
      interval: item.interval || '03:45',
      pic: item.img || item.pic || '',
      url: source === 'wy' && item.songmid ? `https://music.163.com/song/media/outer/url?id=${item.songmid}.mp3` : '',
      source,
      raw: item,
    }))
  } catch (err) {
    console.error('Failed to get board list:', err)
    return []
  }
}

/**
 * 智能获取单曲歌词 (支持五大主流平台 SDK 自动调度)
 */
export async function getSongLyric(item: MusicItem): Promise<string> {
  if (item.lrc) return item.lrc
  const source = item.source || 'wy'
  const sdk = (musicSdk as any)[source]
  if (sdk && sdk.getLyric) {
    try {
      const songInfo = item.raw || {
        songmid: item.id.replace(/^[a-z]+_/, ''),
        name: item.name,
        singer: item.singer,
      }
      const res = await sdk.getLyric(songInfo)
      const data = res?.promise ? await res.promise : await res
      if (data && data.lyric) return data.lyric
    } catch (e) {
      console.warn('Get lyric error:', e)
    }
  }
  return ''
}

/**
 * 智能获取单曲播放直链 (自定义源 UserAPI 优先，内置备选直链回退)
 */
export async function getSongPlayUrl(item: MusicItem): Promise<string> {
  // 1. 已有链接直接返回
  if (item.url && item.url.startsWith('http')) return item.url

  // 2. 自定义音源 UserApi 沙箱调度
  try {
    const customRes = await userApiManager.invokeSource('musicUrl', {
      source: item.source,
      songInfo: item.raw || item,
      type: '128k',
    })
    if (customRes && customRes.url) return customRes.url
    if (typeof customRes === 'string' && customRes.startsWith('http')) return customRes
  } catch (err) {
    //
  }

  // 3. 网易云免鉴权外部播放流回退
  const rawId = item.id.replace(/^[a-z]+_/, '')
  if (item.source === 'wy' || !item.source) {
    return `https://music.163.com/song/media/outer/url?id=${rawId}.mp3`
  }

  return ''
}

