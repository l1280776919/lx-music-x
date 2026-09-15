<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md transition-opacity"
    @click.self="emit('update:modelValue', false)"
  >
    <div class="w-[580px] max-h-[85vh] flex flex-col rounded-2xl bg-[#121316]/95 backdrop-blur-2xl border border-white/[0.1] p-6 shadow-2xl text-zinc-100 space-y-5 select-none">
      <!-- 弹窗标题 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/25">
            <Link2 class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-white tracking-wide">导入外部在线歌单</h3>
            <p class="text-[11px] text-zinc-400">支持网易云音乐、QQ 音乐等主流平台歌单链接一键解析</p>
          </div>
        </div>
        <button
          class="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          @click="emit('update:modelValue', false)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- 链接输入框 -->
      <div class="space-y-2">
        <label class="text-xs font-medium text-zinc-300">歌单链接或 ID</label>
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <input
              v-model="inputUrl"
              type="text"
              placeholder="粘贴歌单分享链接，如 https://music.163.com/playlist?id=xxx"
              class="w-full h-9.5 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-sky-500/60 focus:bg-white/[0.08] outline-none transition"
              @keydown.enter="handleParse"
            />
          </div>
          <button
            class="h-9.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            :disabled="isLoading || !inputUrl.trim()"
            @click="handleParse"
          >
            <Loader2 v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
            <Search v-else class="w-3.5 h-3.5" />
            <span>{{ isLoading ? '解析中...' : '解析歌单' }}</span>
          </button>
        </div>
        <div class="text-[11px] text-zinc-500 flex items-center gap-3">
          <span>示例：网易云或 QQ 音乐客户端点击“分享歌单 - 复制链接”直接粘贴</span>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0" />
        <span class="truncate">{{ errorMessage }}</span>
      </div>

      <!-- 解析结果预览区 -->
      <div v-if="parsedDetail" class="flex-1 overflow-hidden flex flex-col space-y-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
        <!-- 歌单简要元数据 -->
        <div class="flex items-center gap-3">
          <img
            :src="parsedDetail.cover || defaultCover"
            alt="cover"
            class="w-14 h-14 rounded-xl object-cover bg-white/5 border border-white/10 flex-shrink-0"
            @error="onImgError"
          />
          <div class="min-w-0 flex-1 space-y-1">
            <h4 class="text-sm font-bold text-white truncate" :title="parsedDetail.name">{{ parsedDetail.name }}</h4>
            <div class="text-xs text-zinc-400 flex items-center gap-2 truncate">
              <span v-if="parsedDetail.author" class="truncate">创建者: {{ parsedDetail.author }}</span>
              <span class="text-sky-400 font-medium">共 {{ parsedDetail.songs.length }} 首歌曲</span>
            </div>
            <p v-if="parsedDetail.description" class="text-[11px] text-zinc-500 truncate" :title="parsedDetail.description">
              {{ parsedDetail.description }}
            </p>
          </div>
        </div>

        <!-- 歌曲列表预览 -->
        <div class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pt-1">
          歌曲列表预览 (共 {{ parsedDetail.songs.length }} 首)
        </div>
        <div class="max-h-36 overflow-y-auto divide-y divide-white/[0.04] text-xs">
          <div
            v-for="(s, idx) in parsedDetail.songs.slice(0, 15)"
            :key="s.id"
            class="py-1.5 px-2 flex items-center justify-between text-zinc-300"
          >
            <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
              <span class="font-mono text-zinc-500 text-[10px] w-5 text-right flex-shrink-0">{{ idx + 1 }}</span>
              <span class="truncate font-medium text-zinc-200">{{ s.name }}</span>
            </div>
            <span class="text-zinc-500 truncate max-w-[140px] text-right flex-shrink-0">{{ s.singer }}</span>
          </div>
          <div v-if="parsedDetail.songs.length > 15" class="py-1.5 text-center text-zinc-500 text-[11px]">
            ... 以及另外 {{ parsedDetail.songs.length - 15 }} 首歌曲
          </div>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.08]">
        <button
          class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition cursor-pointer"
          @click="emit('update:modelValue', false)"
        >
          取消
        </button>
        <button
          class="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-lg shadow-sky-500/20"
          :disabled="!parsedDetail || isImporting"
          @click="handleImport"
        >
          <Loader2 v-if="isImporting" class="w-3.5 h-3.5 animate-spin" />
          <Check v-else class="w-3.5 h-3.5" />
          <span>{{ isImporting ? '导入中...' : '确认导入至我的歌单' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Link2, X, Search, Loader2, AlertCircle, Check } from 'lucide-vue-next'
import { fetchOnlinePlaylistDetail, OnlinePlaylistDetail } from '@/core/onlineMusic'
import { usePlaylistStore } from '@/store/playlist'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'imported', playlistId: string): void
}>()

const playlistStore = usePlaylistStore()
const inputUrl = ref('')
const isLoading = ref(false)
const isImporting = ref(false)
const errorMessage = ref('')
const parsedDetail = ref<OnlinePlaylistDetail | null>(null)

const defaultCover = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2327272a"/><circle cx="50" cy="50" r="38" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="50" cy="50" r="26" fill="%2327272a"/><circle cx="50" cy="50" r="14" fill="%2338bdf8"/><circle cx="50" cy="50" r="4" fill="%2309090b"/></svg>'

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== defaultCover) {
    target.src = defaultCover
  }
}

async function handleParse() {
  if (!inputUrl.value.trim()) return
  isLoading.value = true
  errorMessage.value = ''
  parsedDetail.value = null

  try {
    const res = await fetchOnlinePlaylistDetail(inputUrl.value.trim())
    parsedDetail.value = res
  } catch (err: any) {
    errorMessage.value = err?.message || String(err)
  } finally {
    isLoading.value = false
  }
}

async function handleImport() {
  if (!parsedDetail.value || !parsedDetail.value.songs.length) return
  isImporting.value = true
  try {
    const newPlaylist = await playlistStore.createPlaylist(parsedDetail.value.name)
    if (newPlaylist && newPlaylist.id) {
      await playlistStore.batchAddSongs(newPlaylist.id, parsedDetail.value.songs)
      emit('imported', newPlaylist.id)
      emit('update:modelValue', false)
      inputUrl.value = ''
      parsedDetail.value = null
    }
  } catch (err: any) {
    errorMessage.value = `导入失败: ${err?.message || err}`
  } finally {
    isImporting.value = false
  }
}
</script>
