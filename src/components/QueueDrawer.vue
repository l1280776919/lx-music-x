<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div
      v-if="playerStore.isQueueOpen"
      class="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border-l border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl flex flex-col select-none"
    >
      <!-- 队列头部 -->
      <header class="p-5 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between flex-shrink-0">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-extrabold text-zinc-900 dark:text-zinc-50">当前播放队列</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 font-mono">
              {{ playerStore.playlist.length }} 首
            </span>
          </div>
          <p class="text-xs text-zinc-400 mt-0.5">{{ playModeLabel }} · 随心听</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="playerStore.playlist.length > 0"
            class="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition active:scale-95"
            title="清空队列"
            @click="handleClearQueue"
          >
            <Trash2 class="w-4 h-4" />
          </button>
          <button
            class="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95"
            @click="playerStore.isQueueOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- 队列歌曲滚动区 -->
      <div class="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/30">
        <div
          v-if="playerStore.playlist.length === 0"
          class="py-32 flex flex-col items-center justify-center text-zinc-400 text-xs gap-3"
        >
          <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <Music class="w-6 h-6 stroke-1" />
          </div>
          <div>播放队列为空</div>
          <div class="text-[11px] text-zinc-500">前往【发现音乐】或【我的歌单】添加歌曲吧</div>
        </div>

        <div
          v-for="(song, idx) in playerStore.playlist"
          :key="`${song.id}_${idx}`"
          class="flex items-center justify-between px-4 py-3 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition group cursor-pointer"
          :class="isCurrentSong(song) ? 'bg-emerald-500/10 dark:bg-emerald-500/15' : ''"
          @dblclick="playTrack(idx)"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
            <!-- 序号或动态跳动音阶 -->
            <div class="w-5 text-center flex-shrink-0">
              <div v-if="isCurrentSong(song) && playerStore.isPlaying" class="flex items-end justify-center gap-[2px] h-3">
                <span class="w-[2px] h-full bg-emerald-500 rounded-full animate-bounce"></span>
                <span class="w-[2px] h-2/3 bg-emerald-500 rounded-full animate-bounce delay-75"></span>
                <span class="w-[2px] h-4/5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
              </div>
              <span
                v-else
                class="text-xs font-mono text-zinc-400 group-hover:text-emerald-500 transition"
                :class="isCurrentSong(song) ? 'text-emerald-500 font-bold' : ''"
              >
                {{ idx + 1 }}
              </span>
            </div>

            <!-- 歌曲标题与歌手 -->
            <div class="overflow-hidden flex-1">
              <div
                class="text-xs font-semibold truncate transition"
                :class="isCurrentSong(song) ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500'"
              >
                {{ song.name }}
              </div>
              <div class="text-[11px] text-zinc-400 truncate mt-0.5">
                {{ song.singer }}
              </div>
            </div>
          </div>

          <!-- 右侧操作: 播放状态、时长与删除 -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-[11px] font-mono text-zinc-400">{{ song.interval || '03:45' }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition active:scale-90"
              title="从队列移除"
              @click.stop="playerStore.removeFromQueue(idx)"
            >
              <Trash2 class="w-3.5 h-3.5" />
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
