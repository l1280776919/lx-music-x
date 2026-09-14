import Lyric from './lyric-player/index.js'
import { ref } from 'vue'

export interface LyricLine {
  line: number
  text: string
  translation?: string
}

export const currentLineIndex = ref(-1)
export const currentLineText = ref('洛雪音乐 · 享受纯粹的听歌体验')
export const nextLineText = ref('Tauri 2.0 极速轻量重构')
export const lyricLines = ref<string[]>([])

let lyricPlayer: any = null

/**
 * 初始化歌词播放控制器
 */
export function initLyricPlayer() {
  if (lyricPlayer) return lyricPlayer

  lyricPlayer = new Lyric({
    onPlay(line: number, text: string) {
      currentLineIndex.value = line
      currentLineText.value = text || '♪ 伴奏 ♪'
      if (lyricLines.value[line + 1]) {
        nextLineText.value = lyricLines.value[line + 1]
      }
    },
    onSetLyric(lines: string[]) {
      lyricLines.value = lines
      if (lines.length > 0) {
        currentLineText.value = lines[0] || ''
        nextLineText.value = lines[1] || ''
      }
    },
  })

  return lyricPlayer
}

/**
 * 加载新歌词文本 (LRC 格式)
 */
export function loadLyric(lrcText: string, translationText: string = '') {
  const player = initLyricPlayer()
  player.setLyric(lrcText, translationText ? [translationText] : [])
}

/**
 * 同步歌词播放时间 (毫秒)
 */
export function syncLyricTime(timeMs: number) {
  if (!lyricPlayer) return
  lyricPlayer.play(timeMs)
}

/**
 * 暂停歌词同步
 */
export function pauseLyric() {
  if (!lyricPlayer) return
  lyricPlayer.pause()
}
