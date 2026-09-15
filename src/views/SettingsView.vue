<template>
  <div class="p-4 md:p-6 space-y-6 max-w-4xl mx-auto overflow-y-auto">
    <!-- 头部标题 -->
    <header class="space-y-1">
      <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">应用设置</h1>
      <p class="text-xs text-zinc-400">管理音源解析、桌面歌词、数据备份与关于信息</p>
    </header>

    <!-- 1. 桌面歌词与交互 -->
    <section class="space-y-2">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">桌面歌词</h2>
      <div class="bg-white dark:bg-[#18181c] rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40">
        <!-- 开启桌面歌词 -->
        <div class="p-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center flex-shrink-0">
              <Monitor class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-900 dark:text-zinc-100">桌面悬浮歌词</div>
              <div class="text-[11px] text-zinc-400 mt-0.5">置顶透明独立歌词窗口，支持鼠标动态穿透与位置拖拽</div>
            </div>
          </div>
          <!-- 简洁开关 -->
          <div
            class="w-10 h-5 rounded-full transition-colors cursor-pointer p-0.5 relative flex items-center select-none"
            :class="playerStore.isDesktopLyricOpen ? 'bg-brand-500' : 'bg-zinc-200 dark:bg-zinc-700'"
            @click="toggleDesktopLyric"
          >
            <div
              class="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-150"
              :class="playerStore.isDesktopLyricOpen ? 'translate-x-5' : 'translate-x-0'"
            ></div>
          </div>
        </div>

        <!-- 音效均衡器 -->
        <div class="p-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
              <Sliders class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-900 dark:text-zinc-100">音频均衡器 (10-Band EQ)</div>
              <div class="text-[11px] text-zinc-400 mt-0.5">专业频段调节与音效预设（流行、摇滚、人声、平直）</div>
            </div>
          </div>
          <button
            class="desktop-btn-secondary"
            @click="playerStore.isSoundEffectOpen = true"
          >
            打开均衡器
          </button>
        </div>
      </div>
    </section>

    <!-- 2. 音源与自定义扩展 (User API) -->
    <section class="space-y-2">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">音源解析与脚本 (User API)</h2>
      <div class="bg-white dark:bg-[#18181c] rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm p-4 space-y-3.5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
              <Code2 class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-900 dark:text-zinc-100">自定义源脚本 (User API)</div>
              <div class="text-[11px] text-zinc-400 mt-0.5">支持 URL 在线导入与本地 .js 文件导入</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input ref="fileInput" type="file" accept=".js" class="hidden" @change="handleFileUpload" />
            <button
              class="desktop-btn-secondary"
              @click="triggerFilePick"
            >
              <Upload class="w-3.5 h-3.5" />
              <span>本地脚本</span>
            </button>
            <button
              class="desktop-btn-secondary"
              @click="resetDefaultSource"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>恢复默认</span>
            </button>
          </div>
        </div>

        <!-- 在线导入 -->
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <input
              v-model="sourceUrlInput"
              type="text"
              placeholder="输入自定义音源 .js 脚本 URL..."
              class="w-full h-8 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/70 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-brand-500 transition-colors"
              @keyup.enter="handleUrlImport"
            />
          </div>
          <button
            class="desktop-btn-primary"
            :disabled="isImportingUrl"
            @click="handleUrlImport"
          >
            <Globe class="w-3.5 h-3.5" />
            <span>{{ isImportingUrl ? '正在拉取...' : '在线导入' }}</span>
          </button>
        </div>

        <!-- 社区源快速选择 -->
        <div class="flex items-center gap-1.5 flex-wrap text-xs pt-0.5">
          <span class="text-zinc-400 text-[11px]">常用源:</span>
          <button
            v-for="p in presetSources"
            :key="p.name"
            class="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:text-brand-600 dark:hover:text-brand-400 text-zinc-600 dark:text-zinc-300 text-[11px] transition-colors cursor-pointer border border-zinc-200/50 dark:border-zinc-700/50"
            @click="selectPresetSource(p.url)"
          >
            {{ p.name }}
          </button>
        </div>

        <!-- 当前激活脚本状态 -->
        <div v-if="activeScript" class="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
              <span class="w-2 h-2 rounded-full bg-brand-500"></span>
              <span>{{ activeScript.name }}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-500 font-mono">v{{ activeScript.version }}</span>
            </div>
            <span class="text-[11px] text-zinc-400">作者: {{ activeScript.author }}</span>
          </div>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ activeScript.description }}</p>
        </div>
      </div>
    </section>

    <!-- 3. 数据备份与原版兼容迁移 -->
    <section class="space-y-2">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">数据与兼容</h2>
      <div class="bg-white dark:bg-[#18181c] rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Database class="w-4 h-4" />
          </div>
          <div>
            <div class="font-medium text-xs text-zinc-900 dark:text-zinc-100">原版数据迁移 (lx.data.db)</div>
            <div class="text-[11px] text-zinc-400 mt-0.5">自动识别旧版 Electron 桌面端的歌单、收藏并同步至曲库</div>
          </div>
        </div>
        <button
          class="desktop-btn-secondary"
          @click="checkAndImportDb"
        >
          <Database class="w-3.5 h-3.5" />
          <span>{{ dbImportStatus }}</span>
        </button>
      </div>
    </section>

    <!-- 4. 关于洛雪音乐 -->
    <section class="space-y-2">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">关于应用</h2>
      <div class="bg-white dark:bg-[#18181c] rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-sm p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <Music2 class="w-4 h-4" />
            </div>
            <div>
              <div class="font-bold text-xs text-zinc-900 dark:text-zinc-100">洛雪音乐 (LX Music X)</div>
              <div class="text-[10px] text-zinc-400 font-mono">基于 Tauri 2 + Rust + Vue 3</div>
            </div>
          </div>
          <span class="text-xs font-mono text-zinc-400">
            v0.1.5
          </span>
        </div>

        <div class="pt-2 border-t border-zinc-100 dark:border-zinc-800/40 text-[11px] text-zinc-400 leading-relaxed space-y-1">
          <div>开源许可证：Apache-2.0 License</div>
          <div>本软件完全开源免费，仅供个人技术研究与音乐欣赏使用，请支持正版音乐。</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Monitor, Sliders, Code2, Database, Cpu, Plus, Info, Upload, RotateCcw, Globe } from 'lucide-vue-next'
import { usePlayerStore } from '@/store/player'
import { usePlaylistStore } from '@/store/playlist'
import { toggleDesktopLyricWindow, getSystemInfo, scanAndImportLegacyData } from '@/core/tauriBridge'
import { userApiManager, UserApiScriptMeta, DEFAULT_USER_API_URL } from '@/core/userApi/sandbox'

const playerStore = usePlayerStore()
const sysInfo = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const activeScript = ref<UserApiScriptMeta | null>(null)
const dbImportStatus = ref('检查并导入历史数据')

const sourceUrlInput = ref(DEFAULT_USER_API_URL)
const isImportingUrl = ref(false)

const presetSources = [
  { name: 'SixYin 音源 (推荐)', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/sixyin/latest.js' },
  { name: '独家音源 (lx)', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/lx/latest.js' },
  { name: 'Huibq 音源', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/huibq/latest.js' },
  { name: 'Ikun 音源', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/ikun/latest.js' },
]

onMounted(async () => {
  sysInfo.value = await getSystemInfo()
  activeScript.value = await userApiManager.getActiveScript()
  const savedUrl = activeScript.value?.sourceUrl
  if (savedUrl) {
    sourceUrlInput.value = savedUrl
  }
})

function toggleDesktopLyric() {
  playerStore.isDesktopLyricOpen = !playerStore.isDesktopLyricOpen
  toggleDesktopLyricWindow(playerStore.isDesktopLyricOpen)
}

function triggerFilePick() {
  fileInput.value?.click()
}

async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async () => {
    const content = reader.result as string
    try {
      const meta = await userApiManager.loadScript(content)
      activeScript.value = meta
      alert(`音源脚本 [${meta.name}] 导入成功！`)
    } catch (err: any) {
      alert(`导入失败: ${err.message}`)
    }
  }
  reader.readAsText(file)
}

async function handleUrlImport() {
  if (!sourceUrlInput.value.trim()) return
  isImportingUrl.value = true
  try {
    const meta = await userApiManager.loadScriptFromUrl(sourceUrlInput.value.trim())
    activeScript.value = meta
    alert(`音源脚本 [${meta.name}] 在线导入成功！`)
  } catch (err: any) {
    alert(`在线导入失败: ${err.message}`)
  } finally {
    isImportingUrl.value = false
  }
}

async function selectPresetSource(url: string) {
  sourceUrlInput.value = url
  await handleUrlImport()
}

async function resetDefaultSource() {
  const meta = await userApiManager.resetToDefault()
  activeScript.value = meta
  sourceUrlInput.value = DEFAULT_USER_API_URL
  alert('已恢复为默认内置音源！')
}

async function checkAndImportDb() {
  dbImportStatus.value = '正在扫描...'
  try {
    const res = await scanAndImportLegacyData()
      if (res.found) {
        await usePlaylistStore().importLegacyPlaylists(res.playlists)
      dbImportStatus.value = `✓ 已兼容 ${res.playlists.length} 个历史歌单 (${res.total_songs} 首)`
      alert(`成功识别原版数据库！已解析 ${res.playlists.length} 个歌单，共 ${res.total_songs} 首歌曲。请前往【我的歌单】页面播放或管理！`)
    } else {
      dbImportStatus.value = '未发现原版数据'
      alert('未在默认用户目录下找到原版 lx-music-desktop 数据库文件 (lx.data.db)。')
    }
  } catch (err: any) {
    dbImportStatus.value = '导入失败'
    alert(`导入出错: ${err?.message || err}`)
  }
}
</script>
