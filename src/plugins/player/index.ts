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

import { sendCommand } from '@/core/backend'
export const setBiquadGain = (hz: Freqs, gain: number) => sendCommand('eq', { index: freqs.indexOf(hz), gain })
export const applyFreqPreset = (preset: typeof freqsPreset[number]) => sendCommand('eq', { values: freqs.map(hz => preset[`hz${hz}`]) })
