import musicSdk from './musicSdk'
import { userApiManager } from '@/core/userApi/sandbox'
import type { MusicItem } from '@/store/player'

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
      throw new Error(`自定义音源搜索失败: ${err}`)
    }
    throw new Error('当前自定义音源不支持搜索，请选择平台搜索')
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
    throw err
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
    return Array.isArray(list) ? list : list?.list || []
  } catch (err) {
    console.warn('Get boards failed:', err)
    throw err
  }
}

/**
 * 获取排行榜歌曲列表 (直连真实官方热榜，获取 100 首实时排行榜曲目)
 */
export async function getLeaderboardSongs(
  bangId: string,
  source: string = 'wy',
  page: number = 1,
): Promise<MusicItem[]> {
  const cleanId = bangId.replace(/^[a-z]+__/, '')

  // 网易云官方榜单直连 (极速、100% 真实在线，包含真实封面、歌手与直链)
  if (source === 'wy') {
    try {
      const resp = await userApiManager.nativeRequest(
        `https://music.163.com/api/playlist/detail?id=${cleanId}`,
        { method: 'GET' }
      )
      const data = resp.body || resp
      const tracks = data?.result?.tracks || data?.playlist?.tracks || []
      if (Array.isArray(tracks) && tracks.length > 0) {
        return tracks.slice(0, 100).map((t: any) => {
          const singer = (t.artists || t.ar || []).map((a: any) => a.name).join(' / ') || '未知歌手'
          const album = t.album?.name || t.al?.name || '热门精选'
          const pic = t.album?.picUrl || t.al?.picUrl || ''
          const durationSec = Math.floor((t.duration || t.dt || 240000) / 1000)
          const m = Math.floor(durationSec / 60)
          const s = durationSec % 60
          const interval = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`

          return {
            id: `wy_${t.id}`,
            name: t.name,
            singer,
            album,
            interval,
            pic,
            url: `https://music.163.com/song/media/outer/url?id=${t.id}.mp3`,
            source: 'wy',
            raw: t,
          }
        })
      }
    } catch (e) {
      console.warn('Direct NetEase board fetch failed, fallback to sdk:', e)
    }
  }

  // SDK 回退
  const sdk = (musicSdk as any)[source]
  if (!sdk || !sdk.leaderboard) return []

  try {
    const res = await sdk.leaderboard.getList(cleanId, page)
    return (res.list || []).map((item: any) => ({
      id: `${source}_${item.songmid || item.hash || item.id}`,
      name: item.name,
      singer: item.singer,
      album: item.albumName || item.album || '热歌榜',
      interval: item.interval || '03:45',
      pic: item.img || item.pic || '',
      url: source === 'wy' && item.songmid ? `https://music.163.com/song/media/outer/url?id=${item.songmid}.mp3` : '',
      source,
      raw: item,
    }))
  } catch (err) {
    console.error('Failed to get board list:', err)
    throw err
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
      const songInfo = { ...item.raw, songmid: item.raw?.songmid || item.raw?.id || item.id.replace(/^[a-z]+_/, ''),
        ...(!item.raw ? {
        songmid: item.id.replace(/^[a-z]+_/, ''),
        name: item.name,
        singer: item.singer,
        } : {}),
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

  // 2. 自定义音源 UserApi 沙箱调度
  try {
    const customRes = await userApiManager.invokeSource('musicUrl', {
      source: item.source || 'wy',
      songInfo: item.raw || item,
      type: '128k',
    })
    if (customRes && typeof customRes === 'string' && customRes.startsWith('http')) return customRes
    if (customRes && customRes.url && typeof customRes.url === 'string') return customRes.url
  } catch (err) {
    console.warn('UserApi invoke failed:', err)
  }

  if (item.url && /^https?:\/\//.test(item.url)) return item.url

  // 3. 网易云免鉴权外部播放流回退
  const rawId = item.id.replace(/^[a-z]+_/, '')
  if (item.source === 'wy' || !item.source) {
    if (/^\d+$/.test(rawId)) {
      return `https://music.163.com/song/media/outer/url?id=${rawId}.mp3`
    }
  }

  // 4. 跨平台智能回退：针对从 QQ/酷狗/酷我导入的历史歌单，自动在网易云进行同名同歌手曲目音源匹配
  if (item.name) {
    try {
      const searchKey = `${item.name} ${item.singer || ''}`.trim()
      const matchRes = await searchOnlineMusic(searchKey, 'wy', 1, 3)
      if (matchRes.list && matchRes.list.length > 0) {
        const best = matchRes.list[0]
        if (!item.pic && best.pic) item.pic = best.pic
        if (!item.lrc && best.lrc) item.lrc = best.lrc
        if (best.url) return best.url
      }
    } catch (e) {
      console.warn('Cross-platform fallback search failed:', e)
    }
  }

  return ''
}
