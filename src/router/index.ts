import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: () => import('@/views/PlaylistView.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
  },
  {
    path: '/desktop-lyric',
    name: 'DesktopLyric',
    component: () => import('@/views/DesktopLyricView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
