<template>
  <div class="p-6 md:p-10 space-y-8 max-w-4xl mx-auto">
    <!-- 头部标题 -->
    <header class="space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">应用设置</h1>
      <p class="text-sm text-zinc-500">个性化定制音频引擎、桌面悬浮歌词、自定义音源及数据迁移</p>
    </header>

    <!-- 1. 桌面歌词与窗口交互 -->
    <section class="space-y-3">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">桌面歌词与视觉</h2>
      <div class="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/40">
        <!-- 开启桌面歌词 -->
        <div class="p-5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Monitor class="w-5 h-5" />
            </div>
            <div>
              <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">桌面悬浮歌词窗口</div>
              <div class="text-xs text-zinc-400 mt-0.5">置顶透明独立歌词窗口，支持毫秒级逐行滚动与鼠标动态穿透</div>
            </div>
          </div>
          <!-- iOS 风格平滑切换开关 -->
          <div
            class="w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 relative flex items-center select-none"
            :class="playerStore.isDesktopLyricOpen ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'"
            @click="toggleDesktopLyric"
          >
            <div
              class="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200"
              :class="playerStore.isDesktopLyricOpen ? 'translate-x-5' : 'translate-x-0'"
            ></div>
          </div>
        </div>

        <!-- 音效均衡器快捷入口 -->
        <div class="p-5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center flex-shrink-0">
              <Sliders class="w-5 h-5" />
            </div>
            <div>
              <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">专业 10 段硬件 EQ 均衡器</div>
              <div class="text-xs text-zinc-400 mt-0.5">实时原生均衡器，支持流行、摇滚、人声与平直音效</div>
            </div>
          </div>
          <button
            class="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition active:scale-95"
            @click="playerStore.isSoundEffectOpen = true"
          >
            打开调音台
          </button>
        </div>
      </div>
    </section>

    <!-- 2. 音源与自定义扩展 (User API) -->
    <section class="space-y-3">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">音源解析与脚本扩展 (User API)</h2>
      <div class="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center flex-shrink-0">
              <Code2 class="w-5 h-5" />
            </div>
            <div>
              <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">自定义源脚本沙箱 (User API)</div>
              <div class="text-xs text-zinc-400 mt-0.5">支持 URL 在线导入与本地文件导入，通过 Tauri 原生网络直连各平台高保真直链</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input ref="fileInput" type="file" accept=".js" class="hidden" @change="handleFileUpload" />
            <button
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition active:scale-95 border border-zinc-200/50 dark:border-zinc-700/50"
              @click="triggerFilePick"
            >
              <Upload class="w-3.5 h-3.5" />
              <span>本地文件</span>
            </button>
            <button
              class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition active:scale-95 border border-zinc-200/50 dark:border-zinc-700/50"
              @click="resetDefaultSource"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>恢复默认</span>
            </button>
          </div>
        </div>

        <!-- 在线 URL 导入输入框 -->
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <input
              v-model="sourceUrlInput"
              type="text"
              placeholder="输入或粘贴自定义音源 .js 脚本 URL (如 GitHub Raw 或加速链接)..."
              class="w-full px-4 py-2.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
              @keyup.enter="handleUrlImport"
            />
          </div>
          <button
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
            :disabled="isImportingUrl"
            @click="handleUrlImport"
          >
            <Globe class="w-3.5 h-3.5" />
            <span>{{ isImportingUrl ? '正在拉取...' : '在线导入' }}</span>
          </button>
        </div>

        <!-- 常用社区音源推荐快捷导入 Chips -->
        <div class="flex items-center gap-2 flex-wrap text-xs pt-0.5">
          <span class="text-zinc-400 text-[11px] font-medium">推荐开源源:</span>
          <button
            v-for="p in presetSources"
            :key="p.name"
            class="px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-emerald-500/15 hover:text-emerald-500 text-zinc-600 dark:text-zinc-300 text-[11px] transition cursor-pointer border border-zinc-200/40 dark:border-zinc-700/40"
            @click="selectPresetSource(p.url)"
          >
            {{ p.name }}
          </button>
        </div>

        <!-- 当前激活脚本卡片 -->
        <div v-if="activeScript" class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100">{{ activeScript.name }}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono font-bold">v{{ activeScript.version }}</span>
            </div>
            <span class="text-xs text-zinc-400">作者: {{ activeScript.author }}</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ activeScript.description }}</p>
          <div v-if="activeScript.sourceUrl" class="text-[11px] text-zinc-400 font-mono truncate pt-1 border-t border-zinc-200/40 dark:border-zinc-700/40">
            来源: {{ activeScript.sourceUrl }}
          </div>
        </div>

        <div class="flex items-center gap-2.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-700/50">
          <Info class="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>脚本沙箱已内置 Tauri 2 原生 HTTP 模块与 Referer/User-Agent 伪造能力，完美支持高解析度音乐直链提取。</span>
        </div>
      </div>
    </section>

    <!-- 3. 原版数据一键兼容迁移 -->
    <section class="space-y-3">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">数据备份与兼容迁移</h2>
      <div class="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm p-6 flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Database class="w-5 h-5" />
          </div>
          <div>
            <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">原版数据无损升级 (lx.data.db)</div>
            <div class="text-xs text-zinc-400 mt-0.5">自动识别旧版 Electron 桌面端的歌单、我喜欢与试听记录并无缝同步至本地曲库</div>
          </div>
        </div>
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30 transition active:scale-95"
          @click="checkAndImportDb"
        >
          <Database class="w-3.5 h-3.5" />
          <span>{{ dbImportStatus }}</span>
        </button>
      </div>
    </section>

    <!-- 4. 运行环境与底层架构状态 -->
    <section class="space-y-3">
      <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">运行环境与架构状态</h2>
      <div class="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
            <Cpu class="w-4 h-4 text-emerald-500" />
            <span>核心技术栈</span>
          </div>
          <span class="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
            Tauri 2 + Rust + Vue 3.5
          </span>
        </div>

        <div v-if="sysInfo" class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div class="text-zinc-400 text-[10px]">客户端应用</div>
            <div class="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-xs mt-1">{{ sysInfo.app_name }} v{{ sysInfo.version }}</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div class="text-zinc-400 text-[10px]">Tauri 核心框架</div>
            <div class="text-emerald-500 font-bold font-mono text-xs mt-1">{{ sysInfo.tauri_version }}</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div class="text-zinc-400 text-[10px]">操作系统</div>
            <div class="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-xs mt-1 uppercase">{{ sysInfo.os }}</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div class="text-zinc-400 text-[10px]">CPU 架构</div>
            <div class="text-zinc-800 dark:text-zinc-200 font-bold font-mono text-xs mt-1 uppercase">{{ sysInfo.arch }}</div>
          </div>
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
