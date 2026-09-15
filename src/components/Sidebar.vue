<template>
  <aside class="w-52 h-full flex flex-col justify-between py-4 px-3 bg-[#111215]/70 backdrop-blur-xl border-r border-white/[0.08] select-none flex-shrink-0">
    <div class="space-y-5">
      <!-- 导航分组 -->
      <div class="space-y-4">
        <!-- 在线音乐 -->
        <div>
          <div class="px-3 pb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
            在线音乐
          </div>
          <nav class="space-y-1">
            <RouterLink
              v-for="item in onlineNav"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group border border-transparent"
              :class="$route.path === item.path
                ? 'bg-white/10 text-white font-semibold border-white/10 shadow-sm backdrop-blur-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'"
            >
              <component
                :is="item.icon"
                class="w-4 h-4 transition-colors"
                :class="$route.path === item.path ? 'text-sky-400' : 'text-zinc-500 group-hover:text-zinc-300'"
              />
              <span>{{ item.title }}</span>
            </RouterLink>
          </nav>
        </div>

        <!-- 我的音乐 -->
        <div>
          <div class="px-3 pb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
            我的音乐
          </div>
          <nav class="space-y-1">
            <RouterLink
              v-for="item in myNav"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group border border-transparent"
              :class="$route.path === item.path
                ? 'bg-white/10 text-white font-semibold border-white/10 shadow-sm backdrop-blur-md'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'"
            >
              <component
                :is="item.icon"
                class="w-4 h-4 transition-colors"
                :class="$route.path === item.path ? 'text-sky-400' : 'text-zinc-500 group-hover:text-zinc-300'"
              />
              <span>{{ item.title }}</span>
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- 底部设置入口 -->
    <div class="pt-3 border-t border-white/[0.08]">
      <RouterLink
        to="/settings"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group border border-transparent"
        :class="$route.path === '/settings'
          ? 'bg-white/10 text-white font-semibold border-white/10 shadow-sm backdrop-blur-md'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'"
      >
        <Settings
          class="w-4 h-4 transition-colors"
          :class="$route.path === '/settings' ? 'text-sky-400' : 'text-zinc-500 group-hover:text-zinc-300'"
        />
        <span>系统设置</span>
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

