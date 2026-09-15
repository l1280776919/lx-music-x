<template>
  <aside class="w-52 h-full flex flex-col justify-between py-3 px-2.5 bg-zinc-100/80 dark:bg-[#161619] border-r border-zinc-200/80 dark:border-zinc-800/80 select-none flex-shrink-0">
    <div class="space-y-4">
      <!-- 品牌标识 -->
      <div class="flex items-center gap-2.5 px-3 py-1.5">
        <div class="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-sm">
          <Music2 class="w-4 h-4" />
        </div>
        <div class="font-bold text-sm text-zinc-800 dark:text-zinc-100 tracking-tight">
          洛雪音乐
        </div>
      </div>

      <!-- 导航分组 -->
      <div class="space-y-3">
        <!-- 在线音乐 -->
        <div>
          <div class="px-3 pb-1.5 text-[11px] font-medium text-zinc-400 tracking-wider">
            在线音乐
          </div>
          <nav class="space-y-0.5">
            <RouterLink
              v-for="item in onlineNav"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative"
              :class="$route.path === item.path
                ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'"
            >
              <span
                v-if="$route.path === item.path"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-brand-500"
              ></span>
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </nav>
        </div>

        <!-- 我的音乐 -->
        <div>
          <div class="px-3 pb-1.5 text-[11px] font-medium text-zinc-400 tracking-wider">
            我的音乐
          </div>
          <nav class="space-y-0.5">
            <RouterLink
              v-for="item in myNav"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative"
              :class="$route.path === item.path
                ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'"
            >
              <span
                v-if="$route.path === item.path"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-brand-500"
              ></span>
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- 底部设置入口 -->
    <div class="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 px-1">
      <RouterLink
        to="/settings"
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative"
        :class="$route.path === '/settings'
          ? 'bg-brand-500/10 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'"
      >
        <span
          v-if="$route.path === '/settings'"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-brand-500"
        ></span>
        <Settings class="w-4 h-4" />
        <span>设置</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Music2, Compass, Search, Library, Settings } from 'lucide-vue-next'

const $route = useRoute()

const onlineNav = [
  { title: '发现热榜', path: '/', icon: Compass },
  { title: '全网搜索', path: '/search', icon: Search },
]

const myNav = [
  { title: '我的歌单', path: '/playlist', icon: Library },
]
</script>

