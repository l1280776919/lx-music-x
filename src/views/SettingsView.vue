<template>
  <div class="p-6 md:p-8 space-y-6 max-w-4xl mx-auto overflow-y-auto">
    <!-- 头部标题 -->
    <header class="space-y-1">
      <h1 class="text-xl font-bold text-white tracking-wide">应用设置</h1>
      <p class="text-xs text-zinc-400">管理音源解析、桌面歌词、数据备份与关于信息</p>
    </header>

    <!-- 0. 外观与个性化壁纸 -->
    <section class="space-y-2.5">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">外观与个性化壁纸</h2>
      <div class="bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg p-5 space-y-5">
        <!-- 预设壁纸库 -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-sky-400" />
              <span class="text-xs font-medium text-zinc-200">预设壁纸库</span>
            </div>
            <span class="text-[11px] text-zinc-400">点击即时切换主题氛围</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="preset in themeStore.presets"
              :key="preset.id"
              class="group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 aspect-[16/10] flex flex-col justify-end p-2.5"
              :class="themeStore.wallpaperType === 'preset' && themeStore.selectedPresetId === preset.id
                ? 'border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50'
                : 'border-white/10 hover:border-white/30'"
              :style="{ background: preset.preview.startsWith('linear-') || preset.preview.startsWith('radial-') ? preset.preview : undefined }"
              @click="themeStore.selectPreset(preset.id)"
            >
              <img
                v-if="!preset.preview.startsWith('linear-') && !preset.preview.startsWith('radial-')"
                :src="preset.preview"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
              <div class="relative z-10">
                <div class="text-xs font-semibold text-white flex items-center justify-between">
                  <span>{{ preset.name }}</span>
                  <Check
                    v-if="themeStore.wallpaperType === 'preset' && themeStore.selectedPresetId === preset.id"
                    class="w-3.5 h-3.5 text-sky-400"
                  />
                </div>
                <div class="text-[10px] text-zinc-300 truncate mt-0.5">{{ preset.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 自定义壁纸上传与重置 -->
        <div class="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
              <ImageIcon class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-100 flex items-center gap-2">
                <span>自定义本地壁纸</span>
                <span
                  v-if="themeStore.wallpaperType === 'custom'"
                  class="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 font-medium"
                >使用中</span>
              </div>
              <div class="text-[11px] text-zinc-400 mt-0.5">支持上传本地 JPG / PNG / WebP 高清大图，自动持久化存储</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              ref="wallpaperFileInput"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="hidden"
              @change="handleWallpaperUpload"
            />
            <button
              class="desktop-btn-primary"
              @click="triggerWallpaperPick"
            >
              <Upload class="w-3.5 h-3.5" />
              <span>上传壁纸</span>
            </button>
            <button
              class="desktop-btn-secondary"
              @click="themeStore.resetToDefault()"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>恢复默认</span>
            </button>
          </div>
        </div>

        <!-- 视觉调节滑块 (模糊度与遮罩浓度) -->
        <div class="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 模糊度 -->
          <div class="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-300 font-medium">背景模糊 (毛玻璃)</span>
              <span class="text-sky-400 font-mono">{{ themeStore.wallpaperBlur }} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              :value="themeStore.wallpaperBlur"
              class="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
              @input="(e: any) => themeStore.setBlur(Number(e.target.value))"
            />
            <div class="flex justify-between text-[10px] text-zinc-500">
              <span>清晰原图 (0px)</span>
              <span>深邃虚化 (25px)</span>
            </div>
          </div>

          <!-- 遮罩浓度 -->
          <div class="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-300 font-medium">暗色遮罩浓度</span>
              <span class="text-sky-400 font-mono">{{ themeStore.wallpaperDarkness }}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="5"
              :value="themeStore.wallpaperDarkness"
              class="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
              @input="(e: any) => themeStore.setDarkness(Number(e.target.value))"
            />
            <div class="flex justify-between text-[10px] text-zinc-500">
              <span>透亮微光 (20%)</span>
              <span>高对比 (95%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 1. 桌面歌词与交互 -->
    <section class="space-y-2.5">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">桌面歌词 & 音效</h2>
      <div class="bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg overflow-hidden divide-y divide-white/[0.05]">
        <!-- 开启桌面歌词 -->
        <div class="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
          <div class="flex items-center gap-3.5">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0 border border-sky-500/20">
              <Monitor class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-100">桌面悬浮歌词</div>
              <div class="text-[11px] text-zinc-400 mt-0.5">置顶透明独立歌词窗口，支持鼠标动态穿透与位置拖拽</div>
            </div>
          </div>
          <!-- 简洁开关 -->
          <div
            class="w-10 h-5 rounded-full transition-colors cursor-pointer p-0.5 relative flex items-center select-none"
            :class="playerStore.isDesktopLyricOpen ? 'bg-sky-500' : 'bg-white/10'"
            @click="toggleDesktopLyric"
          >
            <div
              class="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-150"
              :class="playerStore.isDesktopLyricOpen ? 'translate-x-5' : 'translate-x-0'"
            ></div>
          </div>
        </div>

        <!-- 音效均衡器 -->
        <div class="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
          <div class="flex items-center gap-3.5">
            <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
              <Sliders class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-100">音频均衡器 (10-Band EQ)</div>
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
    <section class="space-y-2.5">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">音源解析与脚本 (User API)</h2>
      <div class="bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0 border border-sky-500/20">
              <Code2 class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-100">自定义源脚本 (User API)</div>
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
              class="w-full h-8 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-sky-500/60 focus:outline-none transition-colors"
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
        <div class="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span class="text-zinc-400 text-[11px]">常用源:</span>
          <button
            v-for="p in presetSources"
            :key="p.name"
            class="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-sky-400 text-[11px] transition-colors cursor-pointer border border-white/[0.06]"
            @click="selectPresetSource(p.url)"
          >
            {{ p.name }}
          </button>
        </div>

        <!-- 当前激活脚本状态 -->
        <div v-if="activeScript" class="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 font-medium text-zinc-200">
              <span class="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>{{ activeScript.name }}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20">v{{ activeScript.version }}</span>
            </div>
            <span class="text-[11px] text-zinc-400">作者: {{ activeScript.author }}</span>
          </div>
          <p class="text-[11px] text-zinc-400 leading-relaxed">{{ activeScript.description }}</p>
        </div>
      </div>
    </section>

    <!-- 3. 云盘数据同步 (WebDAV) -->
    <section class="space-y-2.5">
      <div class="flex items-center justify-between px-0.5">
        <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">云盘数据同步 (WebDAV)</h2>
        <span
          v-if="lastSyncTimeStr"
          class="text-[10px] text-zinc-400 flex items-center gap-1"
        >
          <CheckCircle2 class="w-3 h-3 text-emerald-400" />
          最近同步: {{ lastSyncTimeStr }}
        </span>
      </div>

      <div class="bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg p-5 space-y-4">
        <!-- 头部说明 -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0 border border-sky-500/20">
              <Cloud class="w-4 h-4" />
            </div>
            <div>
              <div class="font-medium text-xs text-zinc-100 flex items-center gap-2">
                <span>WebDAV 元数据跨端同步</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">Gzip 压缩</span>
              </div>
              <div class="text-[11px] text-zinc-400 mt-0.5">
                同步歌单、收藏、个性化配置与自定义音源。支持坚果云、Alist（挂载网盘）、群晖与 Nextcloud。
              </div>
            </div>
          </div>
        </div>

        <!-- 表单项 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
          <!-- 服务器地址 -->
          <div class="space-y-1.5 md:col-span-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-300 font-medium">WebDAV 服务器端点 (Endpoint)</span>
              <div class="flex items-center gap-2 text-[10px] text-zinc-400">
                <span>快速填充:</span>
                <button
                  type="button"
                  class="text-sky-400 hover:underline cursor-pointer"
                  @click="fillWebdavPreset('https://dav.jianguoyun.com/dav/')"
                >坚果云</button>
                <button
                  type="button"
                  class="text-sky-400 hover:underline cursor-pointer"
                  @click="fillWebdavPreset('http://127.0.0.1:5244/dav/')"
                >Alist 本地</button>
              </div>
            </div>
            <input
              v-model="webdavConfig.endpoint"
              type="text"
              placeholder="例如: https://dav.jianguoyun.com/dav/ 或 http://IP:5244/dav/"
              class="w-full h-8 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-sky-500/60 focus:outline-none transition-colors font-mono"
            />
          </div>

          <!-- 用户名 -->
          <div class="space-y-1.5">
            <span class="text-xs text-zinc-300 font-medium">账号 / 邮箱 (Username)</span>
            <input
              v-model="webdavConfig.username"
              type="text"
              placeholder="WebDAV 用户名或注册邮箱"
              class="w-full h-8 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-sky-500/60 focus:outline-none transition-colors"
            />
          </div>

          <!-- 应用授权密码 -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-300 font-medium">应用授权密码 (Password)</span>
              <button
                type="button"
                class="text-[10px] text-zinc-400 hover:text-zinc-200"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '隐藏' : '显示' }}
              </button>
            </div>
            <div class="relative">
              <input
                v-model="webdavConfig.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="网盘 WebDAV 独立授权密码"
                class="w-full h-8 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-sky-500/60 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <!-- 远程存储路径 -->
          <div class="space-y-1.5 md:col-span-2">
            <span class="text-xs text-zinc-300 font-medium">云端文件路径</span>
            <input
              v-model="webdavConfig.remotePath"
              type="text"
              placeholder="/lx-music/lx_sync_data.json.gz"
              class="w-full h-8 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-sky-500/60 focus:outline-none transition-colors font-mono"
            />
            <p class="text-[10px] text-zinc-500">
              云端文件将自动以 Gzip 压缩存储（约 100~300KB），传输极快且无流量压力。
            </p>
          </div>
        </div>

        <!-- 提示与状态条 -->
        <div
          v-if="webdavStatusMessage"
          class="p-3 rounded-xl text-xs flex items-center justify-between"
          :class="webdavStatusIsError ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'"
        >
          <div class="flex items-center gap-2">
            <AlertCircle v-if="webdavStatusIsError" class="w-4 h-4 flex-shrink-0 text-rose-400" />
            <CheckCircle2 v-else class="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{{ webdavStatusMessage }}</span>
          </div>
          <button
            class="text-[10px] opacity-70 hover:opacity-100 ml-2 cursor-pointer"
            @click="webdavStatusMessage = ''"
          >关闭</button>
        </div>

        <!-- 操作按钮组 -->
        <div class="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2.5">
          <div class="flex items-center gap-2">
            <button
              class="desktop-btn-secondary"
              :disabled="isTestingWebdav || isSyncing"
              @click="handleTestWebdav"
            >
              <RefreshCw :class="{ 'animate-spin': isTestingWebdav }" class="w-3.5 h-3.5" />
              <span>{{ isTestingWebdav ? '正在探测...' : '测试连接' }}</span>
            </button>
            <button
              class="desktop-btn-secondary"
              :disabled="isSyncing"
              @click="handleSaveWebdav"
            >
              <Save class="w-3.5 h-3.5" />
              <span>保存配置</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="desktop-btn-primary"
              :disabled="isSyncing || isTestingWebdav"
              title="拉取云端与本地求并集去重合并，并同步回云盘"
              @click="handleSync('smart')"
            >
              <RefreshCw :class="{ 'animate-spin': isSyncing }" class="w-3.5 h-3.5" />
              <span>智能合并同步</span>
            </button>
            <button
              class="desktop-btn-secondary text-zinc-300"
              :disabled="isSyncing"
              title="将本地当前歌单与设置打包，强制上传并覆盖云端文件"
              @click="handleSync('upload_overwrite')"
            >
              <UploadCloud class="w-3.5 h-3.5" />
              <span>上传覆盖云端</span>
            </button>
            <button
              class="desktop-btn-secondary text-zinc-300"
              :disabled="isSyncing"
              title="从云端下载快照，强制覆盖当前本地歌单与配置"
              @click="handleSync('download_overwrite')"
            >
              <Download class="w-3.5 h-3.5" />
              <span>从云端覆盖本地</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 数据备份与原版兼容迁移 -->
    <section class="space-y-2.5">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">本地数据与兼容迁移</h2>
      <div class="bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg p-5 flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
            <Database class="w-4 h-4" />
          </div>
          <div>
            <div class="font-medium text-xs text-zinc-100">原版数据迁移 (lx.data.db)</div>
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
    <section class="space-y-2.5">
      <h2 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-0.5">关于应用</h2>
      <div class="bg-[#141518]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg p-5 space-y-3.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl overflow-hidden border border-white/10 shadow-md shadow-sky-500/20 flex items-center justify-center">
              <img src="/app-logo.png" alt="LX Music" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="font-bold text-xs text-zinc-100">洛雪音乐 (LX Music X)</div>
              <div class="text-[10px] text-zinc-400 font-mono">基于 Tauri 2 + Rust + Vue 3</div>
            </div>
          </div>
          <span class="text-xs font-mono text-zinc-400">
            v{{ sysInfo?.version || '0.1.7' }}
          </span>
        </div>

        <div class="pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400 leading-relaxed space-y-1">
          <div>开源许可证：Apache-2.0 License</div>
          <div>本软件完全开源免费，仅供个人技术研究与音乐欣赏使用，请支持正版音乐。</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Monitor, Sliders, Code2, Database, Cpu, Plus, Info, Upload, RotateCcw, Globe, Check, Sparkles, Image as ImageIcon, Music2,
  Cloud, RefreshCw, CheckCircle2, AlertCircle, Save, Download, UploadCloud
} from 'lucide-vue-next'
import { usePlayerStore } from '@/store/player'
import { usePlaylistStore } from '@/store/playlist'
import { useThemeStore } from '@/store/theme'
import {
  toggleDesktopLyricWindow, getSystemInfo, scanAndImportLegacyData,
  testWebdavConnection, getWebdavConfig, saveWebdavConfig, syncWebdavData, getAppSettings,
  WebdavConfig
} from '@/core/tauriBridge'
import { userApiManager, UserApiScriptMeta, DEFAULT_USER_API_URL } from '@/core/userApi/sandbox'

const playerStore = usePlayerStore()
const themeStore = useThemeStore()
const sysInfo = ref<any>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const wallpaperFileInput = ref<HTMLInputElement | null>(null)
const activeScript = ref<UserApiScriptMeta | null>(null)
const dbImportStatus = ref('检查并导入历史数据')

const webdavConfig = ref<WebdavConfig>({
  endpoint: '',
  username: '',
  password: '',
  remotePath: '/lx-music/lx_sync_data.json.gz',
})
const showPassword = ref(false)
const isTestingWebdav = ref(false)
const isSyncing = ref(false)
const webdavStatusMessage = ref('')
const webdavStatusIsError = ref(false)
const lastSyncTimeStr = ref('')

const sourceUrlInput = ref(DEFAULT_USER_API_URL)
const isImportingUrl = ref(false)

function triggerWallpaperPick() {
  wallpaperFileInput.value?.click()
}

function handleWallpaperUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Check file size limit (e.g. 15MB)
  if (file.size > 15 * 1024 * 1024) {
    alert('图片文件过大，请选择 15MB 以内的壁纸图片')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    themeStore.setCustomWallpaper(dataUrl)
  }
  reader.readAsDataURL(file)
}

const presetSources = [
  { name: 'SixYin 音源 (推荐)', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/sixyin/latest.js' },
  { name: '独家音源 (lx)', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/lx/latest.js' },
  { name: 'Huibq 音源', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/huibq/latest.js' },
  { name: 'Ikun 音源', url: 'https://raw.githubusercontent.com/pdone/lx-music-source/main/ikun/latest.js' },
]

function fillWebdavPreset(endpoint: string) {
  webdavConfig.value.endpoint = endpoint
}

async function loadWebdavState() {
  try {
    const cfg = await getWebdavConfig()
    if (cfg) {
      webdavConfig.value.endpoint = cfg.endpoint || ''
      webdavConfig.value.username = cfg.username || ''
      webdavConfig.value.password = cfg.password || ''
      webdavConfig.value.remotePath = cfg.remotePath || '/lx-music/lx_sync_data.json.gz'
    }
    const settings = await getAppSettings()
    if (settings && settings.webdav_last_sync_time) {
      const d = new Date(settings.webdav_last_sync_time)
      lastSyncTimeStr.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
    }
  } catch (e) {
    console.error('Failed to load WebDAV state:', e)
  }
}

async function handleTestWebdav() {
  if (!webdavConfig.value.endpoint.trim() || !webdavConfig.value.username.trim()) {
    webdavStatusMessage.value = '请先填写 WebDAV 服务器地址与用户名'
    webdavStatusIsError.value = true
    return
  }
  isTestingWebdav.value = true
  webdavStatusMessage.value = ''
  try {
    await testWebdavConnection(webdavConfig.value)
    webdavStatusMessage.value = 'WebDAV 连接测试成功！服务器与身份认证正常。'
    webdavStatusIsError.value = false
    await saveWebdavConfig(webdavConfig.value)
  } catch (err: any) {
    webdavStatusMessage.value = `连接失败: ${err?.message || err}`
    webdavStatusIsError.value = true
  } finally {
    isTestingWebdav.value = false
  }
}

async function handleSaveWebdav() {
  await saveWebdavConfig(webdavConfig.value)
  webdavStatusMessage.value = 'WebDAV 配置已保存！'
  webdavStatusIsError.value = false
}

async function handleSync(strategy: 'smart' | 'upload_overwrite' | 'download_overwrite') {
  if (!webdavConfig.value.endpoint.trim() || !webdavConfig.value.username.trim()) {
    webdavStatusMessage.value = '请先完善 WebDAV 服务器地址与凭据配置'
    webdavStatusIsError.value = true
    return
  }

  if (strategy === 'upload_overwrite' && !confirm('确定要将本地数据强制覆盖到云盘吗？云端原有的旧同步数据将被替换。')) {
    return
  }
  if (strategy === 'download_overwrite' && !confirm('确定要从云盘下载并覆盖本地数据吗？本地当前未上传的修改将被替换。')) {
    return
  }

  isSyncing.value = true
  webdavStatusMessage.value = ''
  try {
    await saveWebdavConfig(webdavConfig.value)
    const res = await syncWebdavData(webdavConfig.value, strategy)
    if (res.success) {
      webdavStatusMessage.value = `${res.message} (当前共 ${res.playlistCount} 个歌单，${res.songCount} 首歌曲)`
      webdavStatusIsError.value = false
      const d = new Date(res.timestamp)
      lastSyncTimeStr.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
    } else {
      webdavStatusMessage.value = `同步未完成: ${res.message}`
      webdavStatusIsError.value = true
    }
  } catch (err: any) {
    webdavStatusMessage.value = `同步失败: ${err?.message || err}`
    webdavStatusIsError.value = true
  } finally {
    isSyncing.value = false
  }
}

onMounted(async () => {
  sysInfo.value = await getSystemInfo()
  activeScript.value = await userApiManager.getActiveScript()
  const savedUrl = activeScript.value?.sourceUrl
  if (savedUrl) {
    sourceUrlInput.value = savedUrl
  }
  await loadWebdavState()
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
