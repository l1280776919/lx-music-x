<template>
  <div
    v-if="playerStore.isSoundEffectOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
    @click.self="playerStore.isSoundEffectOpen = false"
  >
    <div class="w-[680px] rounded-3xl bg-zinc-900/90 border border-zinc-700/60 p-6 shadow-2xl backdrop-blur-2xl text-zinc-200 space-y-6 animate-in fade-in zoom-in-95 duration-200 select-none">
      <!-- 弹窗标题 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sliders class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-white tracking-wide">专业音频均衡器 (10-Band EQ)</h3>
            <p class="text-xs text-zinc-400">原生音频实时均衡器</p>
          </div>
        </div>
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-800 text-zinc-400 hover:text-white transition active:scale-95"
          @click="playerStore.isSoundEffectOpen = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- 快速预设 -->
      <div class="space-y-2">
        <div class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">音效预设</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="p in freqsPreset"
            :key="p.name"
            class="px-3.5 py-1.5 rounded-xl text-xs font-medium transition"
            :class="activePresetName === p.name ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300'"
            @click="selectPreset(p)"
          >
            {{ p.name }}
          </button>
        </div>
      </div>

      <!-- 10 段频段推子滑块 -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs text-zinc-400">
          <span class="font-semibold uppercase tracking-wider">频段调节 (dB)</span>
          <button class="hover:text-emerald-400 transition" @click="resetEQ">重置平直</button>
        </div>

        <div class="grid grid-cols-10 gap-2 p-4 rounded-2xl bg-black/40 border border-zinc-800/80">
          <div
            v-for="hz in freqs"
            :key="hz"
            class="flex flex-col items-center gap-2 h-44 justify-between"
          >
            <!-- 增益数字 -->
            <span class="text-[10px] font-mono" :class="gains[hz] > 0 ? 'text-emerald-400' : gains[hz] < 0 ? 'text-amber-400' : 'text-zinc-500'">
              {{ gains[hz] > 0 ? `+${gains[hz]}` : gains[hz] }}
            </span>

            <!-- 垂直滑块 -->
            <div class="h-32 flex items-center justify-center">
              <input
                v-model.number="gains[hz]"
                type="range"
                min="-12"
                max="12"
                step="1"
                class="w-28 h-1 bg-zinc-700 rounded-lg appearance-none accent-emerald-500 -rotate-90 cursor-pointer"
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

      <div class="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <div>31Hz 低频下潜 · 1kHz 人声中频 · 16kHz 高频通透</div>
        <button
          class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition shadow-lg shadow-emerald-500/25"
          @click="playerStore.isSoundEffectOpen = false"
        >
          完成并保存
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
