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
      class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-[#18181c] border-l border-zinc-200/80 dark:border-zinc-800/80 shadow-xl flex flex-col select-none"
    >
      <!-- 队列头部 -->
      <header class="p-3.5 border-b border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between flex-shrink-0 bg-zinc-50/50 dark:bg-[#141416]/50">
        <div class="flex items-center gap-2">
          <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">当前播放列表</h3>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-brand-500/10 text-brand-500 font-mono">
            {{ playerStore.playlist.length }} 首
          </span>
        </div>

        <div class="flex items-center gap-1">
          <button
            v-if="playerStore.playlist.length > 0"
            class="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="清空列表"
            @click="handleClearQueue"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
          <button
            class="p-1 rounded text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            @click="playerStore.isQueueOpen = false"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <!-- 队列歌曲滚动区 -->
      <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/30">
        <div
          v-if="playerStore.playlist.length === 0"
          class="py-20 flex flex-col items-center justify-center text-zinc-400 text-xs gap-2"
        >
          <Music class="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
          <div>播放列表为空</div>
        </div>

        <div
          v-for="(song, idx) in playerStore.playlist"
          :key="`${song.id}_${idx}`"
          class="h-11 px-3.5 flex items-center justify-between text-xs hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
          :class="isCurrentSong(song) ? 'bg-brand-500/10 dark:bg-brand-500/15' : ''"
          @dblclick="playTrack(idx)"
        >
          <div class="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
            <!-- 序号或正在播放状态 -->
            <div class="w-5 text-center flex-shrink-0">
              <span v-if="isCurrentSong(song) && playerStore.isPlaying" class="text-brand-500 font-bold text-xs">
                ▶
              </span>
              <span
                v-else
                class="text-xs font-mono text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                :class="isCurrentSong(song) ? 'text-brand-500 font-semibold' : ''"
              >
                {{ idx + 1 }}
              </span>
            </div>

            <!-- 歌曲标题与歌手 -->
            <div class="overflow-hidden flex-1">
              <div
                class="text-xs truncate font-medium"
                :class="isCurrentSong(song) ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-zinc-800 dark:text-zinc-200'"
              >
                {{ song.name }}
              </div>
              <div class="text-[10px] text-zinc-400 truncate mt-0.5">
                {{ song.singer }}
              </div>
            </div>
          </div>

          <!-- 右侧操作: 时长与删除 -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-[10px] font-mono text-zinc-400">{{ song.interval || '03:45' }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-colors"
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
