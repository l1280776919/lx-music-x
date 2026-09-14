import './init'
import * as online from './onlineMusic'
import { userApiManager } from './userApi'
Object.assign(globalThis, {
  async backendCall(action: string, data: any, script: string) {
    if (script) await userApiManager.loadScript(script)
    switch (action) {
      case 'validate': return true
      case 'search': return online.searchOnlineMusic(data.keyword, data.source, data.page, data.limit)
      case 'boards': return online.getOnlineLeaderboards(data.source)
      case 'boardSongs': return online.getLeaderboardSongs(data.bangId, data.source, data.page)
      case 'url': return online.getSongPlayUrl(data)
      case 'lyric': return online.getSongLyric(data)
      default: throw new Error(`未知音源操作: ${action}`)
    }
  },
})
