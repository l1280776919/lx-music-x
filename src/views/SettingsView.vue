<template>
  <div class="p-6 space-y-8 max-w-4xl mx-auto">
    <header>
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">应用设置</h1>
      <p class="text-sm text-zinc-500 mt-1">配置音频引擎、桌面歌词、自定义音源与数据迁移</p>
    </header>

    <!-- 桌面悬浮置顶歌词 -->
    <section class="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl space-y-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mt-0.5 flex-shrink-0">
            <Monitor class="w-4 h-4" />
          </div>
          <div>
            <div class="font-bold text-zinc-900 dark:text-zinc-100 text-base">桌面歌词 (Desktop Lyric)</div>
            <div class="text-xs text-zinc-500 mt-1">开启独立的置顶透明悬浮桌面歌词窗口，支持动态鼠标穿透与双向切歌控制</div>
          </div>
        </div>
        <button
          class="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition active:scale-95 shadow-sm"
          :class="playerStore.isDesktopLyricOpen
            ? 'bg-emerald-500 text-white shadow-emerald-500/25'
            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'"
          @click="toggleDesktopLyric"
        >
          <Check v-if="playerStore.isDesktopLyricOpen" class="w-3.5 h-3.5" />
          <span>{{ playerStore.isDesktopLyricOpen ? '悬浮窗已开启' : '点击开启桌面歌词' }}</span>
        </button>
      </div>
    </section>

    <!-- 自定义源 (User API) 脚本管理 -->
    <section class="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl space-y-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mt-0.5 flex-shrink-0">
            <Code2 class="w-4 h-4" />
          </div>
          <div>
            <div class="font-bold text-zinc-900 dark:text-zinc-100 text-base">自定义源脚本系统 (User API)</div>
            <div class="text-xs text-zinc-500 mt-1">导入 JavaScript 音源解析脚本，利用 Tauri 原生网络栈无跨域解析音源</div>
          </div>
        </div>
        <div>
          <input ref="fileInput" type="file" accept=".js" class="hidden" @change="handleFileUpload" />
          <button
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold border border-emerald-500/30 transition active:scale-95"
            @click="triggerFilePick"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>导入脚本 (.js)</span>
          </button>
        </div>
      </div>

      <!-- 当前已激活的音源卡片 -->
      <div v-if="activeScript" class="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{{ activeScript.name }}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono">v{{ activeScript.version }}</span>
          </div>
          <span class="text-xs text-zinc-400">作者: {{ activeScript.author }}</span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ activeScript.description }}</p>
      </div>

      <div class="flex items-center gap-2 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-400 leading-relaxed">
        <Info class="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span>提示：社区音源脚本采用标准 JavaScript 编写，在闭包沙箱中运行并已自动绑定 Tauri 原生网络能力，完美支持防盗链与 Referer 伪造。</span>
      </div>
    </section>

    <!-- 旧版数据向下兼容迁移 -->
    <section class="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl space-y-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center mt-0.5 flex-shrink-0">
            <Database class="w-4 h-4" />
          </div>
          <div>
            <div class="font-bold text-zinc-900 dark:text-zinc-100 text-base">原版数据一键向下兼容迁移 (lx.data.db)</div>
            <div class="text-xs text-zinc-500 mt-1">自动检测 Electron 版本 lx-music-desktop 的历史歌单、收藏夹和配置，实现无损升级</div>
          </div>
        </div>
        <button
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-xs font-bold border border-blue-500/30 transition active:scale-95"
          @click="checkAndImportDb"
        >
          <Database class="w-3.5 h-3.5" />
          <span>{{ dbImportStatus }}</span>
        </button>
      </div>
    </section>

    <!-- 系统与底层架构信息 -->
    <section class="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl space-y-3 text-xs shadow-sm">
      <div class="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
        <Cpu class="w-4 h-4 text-emerald-500" />
        <span>运行环境与架构状态</span>
      </div>
      <div v-if="sysInfo" class="grid grid-cols-2 md:grid-cols-4 gap-4 text-zinc-500 pt-1">
        <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40">
          <div class="text-zinc-400 text-[10px]">客户端版本</div>
          <div class="text-zinc-800 dark:text-zinc-200 font-bold font-mono mt-0.5">{{ sysInfo.app_name }} v{{ sysInfo.version }}</div>
        </div>
        <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40">
          <div class="text-zinc-400 text-[10px]">Tauri 核心框架</div>
          <div class="text-emerald-500 font-bold font-mono mt-0.5">{{ sysInfo.tauri_version }} (Rust Engine)</div>
        </div>
        <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40">
          <div class="text-zinc-400 text-[10px]">操作系统</div>
          <div class="text-zinc-800 dark:text-zinc-200 font-bold font-mono mt-0.5 uppercase">{{ sysInfo.os }}</div>
        </div>
        <div class="p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40">
          <div class="text-zinc-400 text-[10px]">CPU 架构</div>
          <div class="text-zinc-800 dark:text-zinc-200 font-bold font-mono mt-0.5 uppercase">{{ sysInfo.arch }}</div>
        </div>
      </div>
      <div v-else class="text-zinc-400">正在读取系统底层参数...</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Monitor, Code2, Database, Cpu, Check, Plus, Info } from 'lucide-vue-next'
import { usePlayerStore } from '@/store/player'
import { toggleDesktopLyricWindow, getSystemInfo, scanAndImportLegacyData } from '@/core/tauriBridge'
import { userApiManager, UserApiScriptMeta } from '@/core/userApi/sandbox'

const playerStore = usePlayerStore()
const sysInfo = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const activeScript = ref<UserApiScriptMeta | null>(null)
const dbImportStatus = ref('检查并导入历史数据')

onMounted(async () => {
  sysInfo.value = await getSystemInfo()
  activeScript.value = userApiManager.getActiveScript()
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

async function checkAndImportDb() {
  dbImportStatus.value = '正在扫描...'
  try {
    const res = await scanAndImportLegacyData()
    if (res.found) {
      dbImportStatus.value = `✓ 已兼容 ${res.playlists.length} 个历史歌单 (${res.total_songs} 首)`
      alert(`成功识别原版数据库！已解析 ${res.playlists.length} 个歌单，共 ${res.total_songs} 首歌曲。请前往【我的歌单】页面播放或管理！`)
    } else {
      dbImportStatus.value = '未检测到旧版数据库'
      alert('未检测到原版 lx-music-desktop 数据文件。')
    }
  } catch (err: any) {
    dbImportStatus.value = '导入出错'
    alert(`扫描出错: ${err}`)
  }
}
</script>
