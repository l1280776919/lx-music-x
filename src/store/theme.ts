import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import defaultWallpaper from '@/assets/wallpaper.jpg'

export interface WallpaperPreset {
  id: string
  name: string
  desc: string
  // CSS background image value (url(...) or gradient)
  bg: string
  preview: string
}

export const PRESET_WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'starry',
    name: '星空幻夜',
    desc: '二次元深邃星河与水镜倒影 (默认)',
    bg: `url(${defaultWallpaper})`,
    preview: defaultWallpaper,
  },
  {
    id: 'cyberpunk',
    name: '赛博极光',
    desc: '深邃夜空与冷色调蓝紫霓虹极光',
    bg: 'radial-gradient(ellipse at top left, #1e1b4b 0%, #090d16 50%, #030712 100%)',
    preview: 'linear-gradient(135deg, #312e81 0%, #0f172a 100%)',
  },
  {
    id: 'midnight',
    name: '深空曜黑',
    desc: '极简纯粹黑调与极微弱微光',
    bg: 'radial-gradient(circle at 50% 30%, #181920 0%, #0b0c0e 60%, #050507 100%)',
    preview: 'linear-gradient(135deg, #1f2026 0%, #090a0c 100%)',
  },
  {
    id: 'aurora_teal',
    name: '晨曦青峦',
    desc: '静谧薄雾松林与青碧夜色',
    bg: 'radial-gradient(ellipse at bottom, #06232b 0%, #071217 50%, #030708 100%)',
    preview: 'linear-gradient(135deg, #0e3742 0%, #071317 100%)',
  },
]

const STORAGE_KEY = 'lx_theme_config'
const CUSTOM_BG_KEY = 'lx_custom_wallpaper_data'

export const useThemeStore = defineStore('theme', () => {
  // Load saved config
  const savedConfig = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })()

  // State
  const wallpaperType = ref<'preset' | 'custom'>(savedConfig.wallpaperType || 'preset')
  const selectedPresetId = ref<string>(savedConfig.selectedPresetId || 'starry')
  const wallpaperBlur = ref<number>(typeof savedConfig.wallpaperBlur === 'number' ? savedConfig.wallpaperBlur : 0)
  const wallpaperDarkness = ref<number>(typeof savedConfig.wallpaperDarkness === 'number' ? savedConfig.wallpaperDarkness : 65)
  const showTranslation = ref<boolean>(savedConfig.showTranslation !== false)
  const customWallpaperData = ref<string>(localStorage.getItem(CUSTOM_BG_KEY) || '')

  // Save changes
  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          wallpaperType: wallpaperType.value,
          selectedPresetId: selectedPresetId.value,
          wallpaperBlur: wallpaperBlur.value,
          wallpaperDarkness: wallpaperDarkness.value,
          showTranslation: showTranslation.value,
        }),
      )
    } catch (e) {
      console.warn('Failed to persist theme settings:', e)
    }
  }

  // Computed current background CSS value
  const currentBackground = computed(() => {
    if (wallpaperType.value === 'custom' && customWallpaperData.value) {
      return `url(${customWallpaperData.value})`
    }
    const preset = PRESET_WALLPAPERS.find(p => p.id === selectedPresetId.value) || PRESET_WALLPAPERS[0]
    return preset.bg
  })

  // Actions
  function selectPreset(id: string) {
    selectedPresetId.value = id
    wallpaperType.value = 'preset'
    persist()
  }

  function setCustomWallpaper(base64Data: string) {
    customWallpaperData.value = base64Data
    wallpaperType.value = 'custom'
    try {
      localStorage.setItem(CUSTOM_BG_KEY, base64Data)
    } catch (e) {
      console.warn('Failed to save custom wallpaper (file may be too large):', e)
    }
    persist()
  }

  function setBlur(blur: number) {
    wallpaperBlur.value = Math.max(0, Math.min(30, blur))
    persist()
  }

  function setDarkness(darkness: number) {
    wallpaperDarkness.value = Math.max(20, Math.min(95, darkness))
    persist()
  }

  function toggleTranslation() {
    showTranslation.value = !showTranslation.value
    persist()
  }

  function resetToDefault() {
    wallpaperType.value = 'preset'
    selectedPresetId.value = 'starry'
    wallpaperBlur.value = 0
    wallpaperDarkness.value = 65
    showTranslation.value = true
    persist()
  }

  return {
    wallpaperType,
    selectedPresetId,
    wallpaperBlur,
    wallpaperDarkness,
    showTranslation,
    customWallpaperData,
    currentBackground,
    presets: PRESET_WALLPAPERS,
    selectPreset,
    setCustomWallpaper,
    setBlur,
    setDarkness,
    toggleTranslation,
    resetToDefault,
  }
})
