<template>
  <div
    v-if="playerStore.isSleepTimerOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity"
    @click.self="playerStore.isSleepTimerOpen = false"
  >
    <div class="w-[460px] rounded-2xl bg-[#121316]/95 backdrop-blur-2xl border border-white/[0.1] p-6 shadow-2xl text-zinc-100 space-y-5 select-none animate-scale-up">
      <!-- 弹窗标题 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
            <Moon class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-white tracking-wide">睡眠定时器</h3>
            <p class="text-[11px] text-zinc-400">定时停止播放音乐，助您安心睡眠或专注工作</p>
          </div>
        </div>
        <button
          class="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          @click="playerStore.isSleepTimerOpen = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- 当前激活的定时状态卡片 -->
      <div
        v-if="playerStore.sleepTimerMode"
        class="p-4 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></div>
          <div>
            <div class="text-xs text-zinc-300 font-medium">定时停止进行中</div>
            <div class="text-base font-bold font-mono text-sky-400">
              <template v-if="playerStore.sleepTimerMode === 'track_end'">
                当前歌曲播完后自动停止
              </template>
              <template v-else>
                {{ formatRemaining(playerStore.sleepTimerRemaining || 0) }} 后停止播放
              </template>
            </div>
          </div>
        </div>
        <button
          class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 text-xs font-medium border border-white/10 transition cursor-pointer"
          @click="playerStore.cancelSleepTimer()"
        >
          取消定时
        </button>
      </div>

      <!-- 快速预设选项 -->
      <div class="space-y-2.5">
        <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">选择定时时长</div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="item in presetOptions"
            :key="item.value"
            class="py-2.5 px-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5 border cursor-pointer"
            :class="isPresetActive(item.value)
              ? 'bg-sky-500/20 text-sky-400 border-sky-400/40 shadow-sm font-semibold'
              : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/[0.06]'"
            @click="handleSelectPreset(item.value)"
          >
            <span>{{ item.label }}</span>
            <span class="text-[10px] text-zinc-500">{{ item.sub }}</span>
          </button>
        </div>
      </div>

      <!-- 当前单曲播完停止 -->
      <div class="pt-1">
        <button
          class="w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-all flex items-center justify-between border cursor-pointer"
          :class="playerStore.sleepTimerMode === 'track_end'
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40 font-semibold'
            : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/[0.06]'"
          @click="handleTrackEnd"
        >
          <div class="flex items-center gap-2">
            <Music class="w-3.5 h-3.5 text-indigo-400" />
            <span>当前歌曲播完后停止</span>
          </div>
          <span class="text-[11px] text-zinc-500">本曲播放完毕即暂停</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Moon, X, Music } from 'lucide-vue-next'
import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()

const presetOptions = [
  { label: '15 分钟', value: 15, sub: '稍作小憩' },
  { label: '30 分钟', value: 30, sub: '半小时' },
  { label: '45 分钟', value: 45, sub: '专注一节' },
  { label: '60 分钟', value: 60, sub: '1 小时' },
  { label: '90 分钟', value: 90, sub: '深度放松' },
  { label: '120 分钟', value: 120, sub: '2 小时' },
]

function isPresetActive(mins: number): boolean {
  if (playerStore.sleepTimerMode !== 'time' || playerStore.sleepTimerRemaining === null) return false
  const rem = playerStore.sleepTimerRemaining
  return Math.abs(rem - mins * 60) < 5
}

function handleSelectPreset(mins: number) {
  playerStore.setSleepTimer(mins)
  playerStore.isSleepTimerOpen = false
}

function handleTrackEnd() {
  playerStore.setSleepTimerTrackEnd()
  playerStore.isSleepTimerOpen = false
}

function formatRemaining(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m} 分 ${s.toString().padStart(2, '0')} 秒`
}
</script>
