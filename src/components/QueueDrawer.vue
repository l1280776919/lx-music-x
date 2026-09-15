<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div
      v-if="playerStore.isQueueOpen"
      class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#121316]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col select-none"
    >
      <!-- 队列头部 -->
      <header class="p-3.5 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0 bg-white/[0.02]">
        <div class="flex items-center gap-2">
          <h3 class="text-xs font-bold text-zinc-100">当前播放列表</h3>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 font-mono">
            {{ playerStore.playlist.length }} 首
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button
            v-if="playerStore.playlist.length > 0"
            class="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
            title="清空列表"
            @click="handleClearQueue"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
          <button
            class="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            @click="playerStore.isQueueOpen = false"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <!-- 队列歌曲滚动区 -->
      <div class="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        <div
          v-if="playerStore.playlist.length === 0"
          class="py-20 flex flex-col items-center justify-center text-zinc-500 text-xs gap-2"
        >
          <Music class="w-6 h-6 text-zinc-600" />
          <div>播放列表为空</div>
        </div>

        <div
          v-for="(song, idx) in playerStore.playlist"
          :key="`${song.id}_${idx}`"
          class="h-11 px-3.5 flex items-center justify-between text-xs hover:bg-white/[0.05] transition-colors group cursor-pointer"
          :class="isCurrentSong(song) ? 'bg-sky-500/[0.08] text-white' : ''"
          @dblclick="playTrack(idx)"
        >
          <div class="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            <!-- 序号或正在播放状态 -->
            <div class="w-5 text-center flex-shrink-0">
              <span v-if="isCurrentSong(song) && playerStore.isPlaying" class="text-sky-400 font-bold text-xs">
                ▶
              </span>
              <span
                v-else
                class="text-xs font-mono text-zinc-500 group-hover:text-zinc-300"
                :class="isCurrentSong(song) ? 'text-sky-400 font-semibold' : ''"
              >
                {{ idx + 1 }}
              </span>
            </div>

            <!-- 歌曲标题与歌手 -->
            <div class="overflow-hidden flex-1">
              <div
                class="text-xs truncate font-medium"
                :class="isCurrentSong(song) ? 'text-sky-400 font-semibold' : 'text-zinc-200 group-hover:text-white'"
              >
                {{ song.name }}
              </div>
              <div class="text-[10px] text-zinc-500 truncate mt-0.5">
                {{ song.singer }}
              </div>
            </div>
          </div>

          <!-- 右侧操作: 时长与删除 -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-[10px] font-mono text-zinc-500">{{ song.interval || '03:45' }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              title="从列表中移除"
              @click.stop="playerStore.removeFromQueue(idx)"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, Trash2, Music } from 'lucide-vue-next'
import { usePlayerStore, MusicItem } from '@/store/player'

const playerStore = usePlayerStore()

const playModeLabel = computed(() => {
  switch (playerStore.playMode) {
    case 'single':
      return '单曲循环'
    case 'random':
      return '随机播放'
    default:
      return '列表循环'
  }
})

function isCurrentSong(song: MusicItem): boolean {
  return playerStore.currentMusic?.id === song.id
}

async function playTrack(idx: number) {
  await playerStore.playMusic(playerStore.playlist[idx])
}

function handleClearQueue() {
  if (confirm('确定要清空当前的播放队列吗？')) {
    playerStore.clearQueue()
  }
}
</script>
