<template>
  <div
    v-if="playerStore.isSoundEffectOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity"
    @click.self="playerStore.isSoundEffectOpen = false"
  >
    <div class="w-[620px] rounded-2xl bg-[#121316]/90 backdrop-blur-2xl border border-white/[0.08] p-6 shadow-2xl text-zinc-100 space-y-5 select-none">
      <!-- 弹窗标题 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Sliders class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-white tracking-wide">音频均衡器 (10-Band EQ)</h3>
            <p class="text-[11px] text-zinc-400">调整声音频率曲线，获得更细腻清澈的听感</p>
          </div>
        </div>
        <button
          class="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          @click="playerStore.isSoundEffectOpen = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- 快速预设 -->
      <div class="space-y-2">
        <div class="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">音效预设</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in freqsPreset"
            :key="p.name"
            class="px-3 py-1 rounded-lg text-xs font-medium transition-all"
            :class="activePresetName === p.name ? 'bg-sky-500 text-white font-semibold shadow-sm' : 'bg-white/[0.05] hover:bg-white/10 text-zinc-300 border border-white/[0.06]'"
            @click="selectPreset(p)"
          >
            {{ p.name }}
          </button>
        </div>
      </div>

      <!-- 10 段频段推子滑块 -->
      <div class="space-y-2.5">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span class="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">频段增益 (dB)</span>
          <button class="text-xs text-zinc-400 hover:text-sky-400 transition-colors" @click="resetEQ">重置平直</button>
        </div>

        <div class="grid grid-cols-10 gap-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div
            v-for="hz in freqs"
            :key="hz"
            class="flex flex-col items-center gap-2 h-44 justify-between"
          >
            <!-- 增益数字 -->
            <span class="text-[10px] font-mono font-medium" :class="gains[hz] > 0 ? 'text-sky-400' : gains[hz] < 0 ? 'text-amber-400' : 'text-zinc-500'">
              {{ gains[hz] > 0 ? `+${gains[hz]}` : gains[hz] }}
            </span>

            <!-- 垂直滑块 -->
            <div class="h-28 flex items-center justify-center">
              <input
                v-model.number="gains[hz]"
                type="range"
                min="-12"
                max="12"
                step="1"
                class="w-24 h-1.5 bg-white/10 rounded appearance-none accent-sky-400 -rotate-90 cursor-pointer"
                @input="handleGainChange(hz)"
              />
            </div>

            <!-- 频段标签 -->
            <span class="text-[10px] text-zinc-400 font-mono">
              {{ hz >= 1000 ? `${hz / 1000}k` : hz }}
            </span>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-white/[0.06] flex items-center justify-end">
        <button
          class="desktop-btn-primary"
          @click="playerStore.isSoundEffectOpen = false"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { backendState } from '@/core/backend'
import { Sliders, X } from 'lucide-vue-next'
import { usePlayerStore } from '@/store/player'
import { freqs, freqsPreset, setBiquadGain, applyFreqPreset, Freqs } from '@/plugins/player'

const playerStore = usePlayerStore()
const activePresetName = ref('平直 (Flat)')

const gains = reactive<Record<number, number>>({
  31: 6,
  62: 5,
  125: -3,
  250: -2,
  500: 5,
  1000: 4,
  2000: -4,
  4000: -3,
  8000: 6,
  16000: 4,
})

function handleGainChange(hz: Freqs) {
  activePresetName.value = '自定义'
  setBiquadGain(hz, gains[hz])
}

watch(() => backendState.library.eq, values => {
  freqs.forEach((hz, i) => { gains[hz] = values[i] })
  activePresetName.value = freqsPreset.find(p => freqs.every((hz, i) => p[`hz${hz}`] === values[i]))?.name || '自定义'
}, { immediate: true })

function selectPreset(preset: typeof freqsPreset[number]) {
  activePresetName.value = preset.name
  for (const hz of freqs) {
    const key = `hz${hz}` as keyof typeof preset
    if (typeof preset[key] === 'number') {
      gains[hz] = preset[key] as number
    }
  }
  applyFreqPreset(preset)
}

function resetEQ() {
  const flat = freqsPreset.find(p => p.name.includes('平直'))!
  selectPreset(flat)
}
</script>
