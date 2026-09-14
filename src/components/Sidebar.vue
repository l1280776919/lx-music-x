<template>
  <aside class="w-60 h-full flex flex-col justify-between p-4 bg-zinc-50/90 dark:bg-zinc-950/90 border-r border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-2xl select-none flex-shrink-0">
    <!-- 顶部应用品牌 -->
    <div class="space-y-6">
      <div class="flex items-center gap-3 px-3 py-2">
        <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
          <Music2 class="w-5 h-5" />
        </div>
        <div>
          <div class="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 tracking-tight">LX Music X</div>
          <div class="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Tauri 2 · Desktop</div>
        </div>
      </div>

      <!-- 导航列表 (使用专业矢量矢量图标代替 Emoji) -->
      <nav class="space-y-1 px-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group relative"
          :class="$route.path === item.path
            ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 hover:text-zinc-900 dark:hover:text-zinc-100'"
        >
          <component :is="item.icon" class="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>{{ item.title }}</span>
          <span
            v-if="$route.path === item.path"
            class="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500"
          ></span>
        </RouterLink>
      </nav>
    </div>

    <!-- 底部播放内核状态 -->
    <div class="px-3 py-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
      <div class="flex items-center justify-between font-semibold">
        <span class="text-zinc-700 dark:text-zinc-300">音频渲染器</span>
        <span class="text-emerald-500 text-[10px] font-mono">WebAudio 2.0</span>
      </div>
      <div class="text-[10px] text-zinc-400">10-Band EQ · 无损流支持</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Music2, Compass, Search, Library, Settings } from 'lucide-vue-next'

const $route = useRoute()

const navItems = [
  { title: '发现音乐', path: '/', icon: Compass },
  { title: '全网搜索', path: '/search', icon: Search },
  { title: '我的歌单', path: '/playlist', icon: Library },
  { title: '应用设置', path: '/settings', icon: Settings },
]
</script>
