import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import * as audioPlugin from '@/plugins/player'
import { loadLyric, syncLyricTime, pauseLyric, currentLineText, nextLineText, currentLineIndex, lyricLines } from '@/core/lyric'
import { broadcastLyricSync, convertLocalAudioSrc } from '@/core/tauriBridge'
import { getSongLyric, getSongPlayUrl } from '@/core/onlineMusic'

export interface MusicItem {
  id: string
  name: string
  singer: string
  album?: string
  interval?: string
  source?: string
  pic?: string
  url?: string
  lrc?: string
  path?: string
  raw?: any
}

export type PlayMode = 'list' | 'single' | 'random'

const DEMO_LRC = `[00:00.00]海阔天空 - Beyond
[00:03.00]词：黄家驹
[00:06.00]曲：黄家驹
[00:18.50]今天我 寒夜里看雪飘过
[00:25.10]怀着冷却了的心窝飘远方
[00:30.90]风雨里追赶 雾里分不清影踪
[00:37.30]天空海阔你与我 可会变 (谁没在变)
[00:43.70]多少次 迎着冷眼与嘲笑
[00:50.00]从没有放弃过心中的理想
[00:56.20]一刹那恍惚 若有所失的感觉
[01:02.50]不知不觉已变淡 心里爱 (谁明白我)
[01:09.00]原谅我这一生不羁放纵爱自由
[01:16.10]也会怕有一天会跌倒
[01:22.40]背弃了理想 谁人都可以
[01:28.70]哪会怕有一天只你共我
[01:42.00]今天我 寒夜里看雪飘过
[01:48.50]怀着冷却了的心窝飘远方
[01:54.60]风雨里追赶 雾里分不清影踪
[02:01.00]天空海阔你与我 可会变 (谁没在变)
[02:07.50]原谅我这一生不羁放纵爱自由
[02:14.60]也会怕有一天会跌倒
[02:20.90]背弃了理想 谁人都可以
[02:27.20]哪会怕有一天只你共我
[03:00.00]仍然自由自我 永远高唱我歌 走遍千里
[03:10.00]原谅我这一生不羁放纵爱自由
[03:17.30]也会怕有一天会跌倒
[03:23.60]背弃了理想 谁人都可以
[03:29.80]哪会怕有一天只你共我`

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false)
  const currentMusic = ref<MusicItem | null>(null)
  const currentTime = ref(0)
  const duration = ref(324)
  const volume = ref(0.8)
  const isMuted = ref(false)
  const currentIndex = ref(0)
  const isDesktopLyricOpen = ref(false)

  // 现代交互拓展状态
  const isDetailOpen = ref(false) // 沉浸式大屏歌词页面展示
  const isSoundEffectOpen = ref(false) // 音效与 10 段 EQ 弹窗
  const playMode = ref<PlayMode>('list') // 播放模式: 列表循环 | 单曲循环 | 随机播放
  const favoriteIds = ref<Set<string>>(new Set(['demo-1'])) // 收藏喜欢的歌曲

  // 精选演示歌单 (配高质量封面与试听流)
  const playlist = ref<MusicItem[]>([
    {
      id: 'demo-1',
      name: '海阔天空',
      singer: 'Beyond',
      album: '海阔天空',
      interval: '05:24',
      source: 'local',
      pic: 'https://p2.music.126.net/H7z8x1pC94_e1JzS6o0w4w==/109951165647004069.jpg',
      url: 'https://music.163.com/song/media/outer/url?id=347230.mp3',
      lrc: DEMO_LRC,
    },
    {
      id: 'demo-2',
      name: '光辉岁月',
      singer: 'Beyond',
      album: '命运派对',
      interval: '05:03',
      source: 'local',
      pic: 'https://p2.music.126.net/1omQ2163PkWX509Z5_b4lA==/109951163240682406.jpg',
      url: 'https://music.163.com/song/media/outer/url?id=346576.mp3',
      lrc: `[00:00.00]光辉岁月 - Beyond\n[00:04.00]钟声响起归家的讯号\n[00:08.00]在他生命里 仿佛带点唏嘘\n[00:15.00]黑色肌肤给他的意义\n[00:19.00]是一生奉献 肤色斗争中`,
    },
    {
      id: 'demo-3',
      name: '晴天',
      singer: '周杰伦',
      album: '叶惠美',
      interval: '04:29',
      source: 'local',
      pic: 'https://p1.music.126.net/F5f1fF7dYgC895_B2GvQ_g==/109951168173458641.jpg',
      url: 'https://music.163.com/song/media/outer/url?id=186016.mp3',
      lrc: `[00:00.00]晴天 - 周杰伦\n[00:28.00]故事的小黄花 从出生那年就飘着\n[00:34.00]童年的荡秋千 随记忆一直晃到现在\n[00:41.00]Re So So Si Do Si La\n[00:44.00]So La Si Si Si Si La Si La So`,
    },
    {
      id: 'demo-4',
      name: '起风了',
      singer: '买辣椒也用券',
      album: '起风了',
      interval: '05:25',
      source: 'local',
      pic: 'https://p2.music.126.net/diGAyEmpymX8G7JukHgopA==/109951163699673355.jpg',
      url: 'https://music.163.com/song/media/outer/url?id=1330348068.mp3',
      lrc: `[00:00.00]起风了 - 买辣椒也用券\n[00:22.00]这一路上走走停停 顺着少年漂流的痕迹\n[00:28.00]迈出车站的前一刻 竟有些犹豫\n[00:34.00]不禁笑这近乡情怯 仍无可避免`,
    },
  ])

  // 初始化默认首曲
  currentMusic.value = playlist.value[0]

  // 绑定底层音频事件
  audioPlugin.onTimeUpdate((curr, dur) => {
    currentTime.value = curr
    if (dur && !isNaN(dur)) duration.value = dur
    syncLyricTime(curr * 1000)
  })

  // 监听歌词变化并向桌面歌词窗口广播同步
  watch(currentLineText, (newText) => {
    broadcastLyricSync({
      currentLine: newText,
      nextLine: nextLineText.value,
      isPlaying: isPlaying.value,
      songName: currentMusic.value?.name || '',
      singer: currentMusic.value?.singer || '',
    })
  })

  audioPlugin.onPlayStateChange((playing) => {
    isPlaying.value = playing
    if (!playing) pauseLyric()
    broadcastLyricSync({
      currentLine: currentLineText.value,
      nextLine: nextLineText.value,
      isPlaying: playing,
      songName: currentMusic.value?.name || '',
      singer: currentMusic.value?.singer || '',
    })
  })

  const progressPercent = computed(() => {
    if (!duration.value) return 0
    return (currentTime.value / duration.value) * 100
  })

  function isFavorite(id: string): boolean {
    return favoriteIds.value.has(id)
  }

  function toggleFavorite(id: string) {
    if (favoriteIds.value.has(id)) {
      favoriteIds.value.delete(id)
    } else {
      favoriteIds.value.add(id)
    }
  }

  function cyclePlayMode() {
    const modes: PlayMode[] = ['list', 'single', 'random']
    const nextIdx = (modes.indexOf(playMode.value) + 1) % modes.length
    playMode.value = modes[nextIdx]
  }

  async function playMusic(item: MusicItem) {
    currentMusic.value = item

    // 1. 获取有效音频播放地址
    let audioUrl = item.url
    if (!audioUrl && item.path) {
      audioUrl = convertLocalAudioSrc(item.path)
      item.url = audioUrl
    }
    if (!audioUrl) {
      audioUrl = await getSongPlayUrl(item)
      item.url = audioUrl
    }

    // 2. 获取歌词
    if (!item.lrc && item.source !== 'local') {
      const lyric = await getSongLyric(item)
      if (lyric) {
        item.lrc = lyric
      }
    }

    if (item.lrc) {
      loadLyric(item.lrc)
    } else {
      loadLyric(`[00:00.00]${item.name} - ${item.singer}\n[00:01.00]纯音乐或暂无在线歌词`)
    }

    // 3. 驱动 Web Audio 底层播放
    if (audioUrl) {
      audioPlugin.setResource(audioUrl)
      try {
        await audioPlugin.play()
        isPlaying.value = true
      } catch (e) {
        console.warn('Playback error or user gesture required:', e)
      }
    } else {
      console.warn('No playable URL for track:', item.name)
    }
  }

  async function togglePlay() {
    if (!currentMusic.value) {
      if (playlist.value.length > 0) {
        await playMusic(playlist.value[0])
      }
      return
    }

    if (isPlaying.value) {
      audioPlugin.pause()
      isPlaying.value = false
    } else {
      if (currentMusic.value.url) {
        audioPlugin.setResource(currentMusic.value.url)
        if (currentMusic.value.lrc) {
          loadLyric(currentMusic.value.lrc)
        }
      }
      try {
        await audioPlugin.play()
        isPlaying.value = true
      } catch (e) {
        console.warn('Playback resume failed:', e)
      }
    }
  }

  function setVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val))
    volume.value = clamped
    audioPlugin.setVolume(clamped)
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
    audioPlugin.setMuted(isMuted.value)
  }

  function seekTime(time: number) {
    currentTime.value = time
    audioPlugin.seek(time)
    syncLyricTime(time * 1000)
  }

  async function playNext() {
    if (!playlist.value.length) return
    if (playMode.value === 'random') {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length)
    } else if (playMode.value === 'single') {
      // 保持当前
    } else {
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    }
    await playMusic(playlist.value[currentIndex.value])
  }

  async function playPrev() {
    if (!playlist.value.length) return
    if (playMode.value === 'random') {
      currentIndex.value = Math.floor(Math.random() * playlist.value.length)
    } else {
      currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    }
    await playMusic(playlist.value[currentIndex.value])
  }

  return {
    isPlaying,
    currentMusic,
    currentTime,
    duration,
    volume,
    isMuted,
    playlist,
    currentIndex,
    isDesktopLyricOpen,
    isDetailOpen,
    isSoundEffectOpen,
    playMode,
    favoriteIds,
    progressPercent,
    currentLineText,
    nextLineText,
    currentLineIndex,
    lyricLines,
    isFavorite,
    toggleFavorite,
    cyclePlayMode,
    togglePlay,
    playMusic,
    setVolume,
    toggleMute,
    seekTime,
    playNext,
    playPrev,
  }
})
