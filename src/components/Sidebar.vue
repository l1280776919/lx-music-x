<template>
  <aside class="w-56 h-full flex flex-col justify-between p-4 bg-zinc-50/80 dark:bg-zinc-950/80 border-r border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl select-none">
    <!-- 应用品牌 Logo -->
    <div class="space-y-6">
      <div class="flex items-center gap-3 px-2 py-1">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
          LX
        </div>
        <div>
          <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-wide">LX Music X</div>
          <div class="text-[10px] text-zinc-400 font-mono">Tauri 2 Edition</div>
        </div>
      </div>

      <!-- 导航列表 -->
      <nav class="space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group"
          :class="$route.path === item.path
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'"
        >
          <span class="text-base">{{ item.icon }}</span>
          <span>{{ item.title }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- 底部状态与链接 -->
    <div class="px-2 py-2 text-[11px] text-zinc-400 border-t border-zinc-200/40 dark:border-zinc-800/40">
      <div>内存极低 · 极速运行</div>
      <div class="mt-0.5 text-zinc-500">v0.1.0-alpha</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const $route = useRoute()

const navItems = [
  { title: '发现音乐', path: '/', icon: '🔥' },
  { title: '搜索', path: '/search', icon: '🔍' },
  { title: '我的歌单', path: '/playlist', icon: '🎵' },
  { title: '应用设置', path: '/settings', icon: '⚙️' },
]
</script>
