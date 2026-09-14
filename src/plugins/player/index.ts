export const freqs = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const
export type Freqs = (typeof freqs)[number]

export const freqsPreset = [
  { name: '流行 (Pop)', hz31: 6, hz62: 5, hz125: -3, hz250: -2, hz500: 5, hz1000: 4, hz2000: -4, hz4000: -3, hz8000: 6, hz16000: 4 },
  { name: '摇滚 (Rock)', hz31: 7, hz62: 6, hz125: 2, hz250: 1, hz500: -3, hz1000: -4, hz2000: 2, hz4000: 1, hz8000: 4, hz16000: 5 },
  { name: '舞曲 (Dance)', hz31: 4, hz62: 3, hz125: -4, hz250: -6, hz500: 0, hz1000: 0, hz2000: 3, hz4000: 4, hz8000: 4, hz16000: 5 },
  { name: '古典 (Classical)', hz31: 6, hz62: 7, hz125: 1, hz250: 2, hz500: -1, hz1000: 1, hz2000: -4, hz4000: -6, hz8000: -7, hz16000: -8 },
  { name: '人声 (Vocal)', hz31: -5, hz62: -6, hz125: -4, hz250: -3, hz500: 3, hz1000: 4, hz2000: 5, hz4000: 4, hz8000: -3, hz16000: -3 },
  { name: '重低音 (Subwoofer)', hz31: 8, hz62: 7, hz125: 5, hz250: 4, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 0, hz16000: 0 },
  { name: '平直 (Flat)', hz31: 0, hz62: 0, hz125: 0, hz250: 0, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 0, hz16000: 0 },
] as const

let audio: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let mediaSource: MediaElementAudioSourceNode | null = null
let analyser: AnalyserNode | null = null
let biquads: Map<`hz${Freqs}`, BiquadFilterNode> = new Map()
let convolver: ConvolverNode | null = null
let convolverSourceGainNode: GainNode | null = null
let convolverOutputGainNode: GainNode | null = null
let gainNode: GainNode | null = null

/**
 * 初始化基础 HTML5 Audio 实例
 */
export const createAudio = (): HTMLAudioElement => {
  if (audio) return audio
  audio = new Audio()
  audio.controls = false
  audio.autoplay = true
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'

  audio.addEventListener('playing', () => {
    if (audioContext?.state === 'suspended') {
      void audioContext.resume()
    }
  })

  return audio
}

/**
 * 初始化 Web Audio 高级音频管道 (EQ 10段、混响卷积、频谱分析)
 */
export const initAdvancedAudio = () => {
  if (audioContext) return
  if (!audio) createAudio()

  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    latencyHint: 'playback',
  })

  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256

  // 初始化 10 段均衡器
  biquads = new Map()
  for (const item of freqs) {
    const filter = audioContext.createBiquadFilter()
    biquads.set(`hz${item}`, filter)
    filter.type = 'peaking'
    filter.frequency.value = item
    filter.Q.value = 1.4
    filter.gain.value = 0
  }

  // 级联连接 10 个滤波节点
  for (let i = 1; i < freqs.length; i++) {
    const prev = biquads.get(`hz${freqs[i - 1]}`)!
    const curr = biquads.get(`hz${freqs[i]}`)!
    prev.connect(curr)
  }

  // 空间混响卷积节点
  convolver = audioContext.createConvolver()
  convolverSourceGainNode = audioContext.createGain()
  convolverOutputGainNode = audioContext.createGain()
  gainNode = audioContext.createGain()

  // 管道连接: mediaSource -> analyser -> 10段EQ -> convolver/gain -> destination
  mediaSource = audioContext.createMediaElementSource(audio!)
  mediaSource.connect(analyser)
  analyser.connect(biquads.get(`hz${freqs[0]}`)!)

  const lastFilter = biquads.get(`hz${freqs[freqs.length - 1]}`)!
  lastFilter.connect(convolverSourceGainNode)
  lastFilter.connect(convolver)

  convolver.connect(convolverOutputGainNode)
  convolverSourceGainNode.connect(gainNode)
  convolverOutputGainNode.connect(gainNode)
  gainNode.connect(audioContext.destination)
}

/**
 * 设置特定频段的增益值 (dB: -12 ~ +12)
 */
export const setBiquadGain = (hz: Freqs, gain: number) => {
  initAdvancedAudio()
  const filter = biquads.get(`hz${hz}`)
  if (filter) {
    filter.gain.value = gain
  }
}

/**
 * 应用 EQ 预设
 */
export const applyFreqPreset = (preset: typeof freqsPreset[number]) => {
  for (const hz of freqs) {
    const key = `hz${hz}` as keyof typeof preset
    if (typeof preset[key] === 'number') {
      setBiquadGain(hz, preset[key] as number)
    }
  }
}

/**
 * 获取频谱可视化数据
 */
export const getFrequencyData = (dataArray: Uint8Array<ArrayBuffer> | any): void => {
  if (!analyser) return
  analyser.getByteFrequencyData(dataArray)
}

// 核心播放控制 API
export const setResource = (url: string) => {
  const a = createAudio()
  a.src = url
}

export const play = async (): Promise<void> => {
  const a = createAudio()
  initAdvancedAudio()
  if (audioContext?.state === 'suspended') {
    await audioContext.resume()
  }
  return a.play()
}

export const pause = () => {
  audio?.pause()
}

export const seek = (seconds: number) => {
  if (audio) {
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, seconds))
  }
}

export const setVolume = (val: number) => {
  if (audio) {
    audio.volume = Math.max(0, Math.min(1, val))
  }
}

export const setMuted = (muted: boolean) => {
  if (audio) {
    audio.muted = muted
  }
}

export const getCurrentTime = (): number => audio?.currentTime || 0
export const getDuration = (): number => audio?.duration || 0

// 事件监听绑定
export const onTimeUpdate = (cb: (currentTime: number, duration: number) => void) => {
  const a = createAudio()
  const handler = () => cb(a.currentTime, a.duration || 0)
  a.addEventListener('timeupdate', handler)
  return () => a.removeEventListener('timeupdate', handler)
}

export const onPlayStateChange = (cb: (isPlaying: boolean) => void) => {
  const a = createAudio()
  const handlePlay = () => cb(true)
  const handlePause = () => cb(false)
  const handleEnded = () => cb(false)

  a.addEventListener('play', handlePlay)
  a.addEventListener('pause', handlePause)
  a.addEventListener('ended', handleEnded)

  return () => {
    a.removeEventListener('play', handlePlay)
    a.removeEventListener('pause', handlePause)
    a.removeEventListener('ended', handleEnded)
  }
}

export const onError = (cb: (err: any) => void) => {
  const a = createAudio()
  a.addEventListener('error', cb)
  return () => a.removeEventListener('error', cb)
}
