export * from '@/common/utils/common'
export * from '@/common/utils/tools'

export const decodeName = (str: string | null = '') => {
  if (!str) return ''
  try {
    return new window.DOMParser().parseFromString(str, 'text/html').body.textContent || ''
  } catch (_) {
    return str
  }
}

export const formatPlayCount = (num: number): string => {
  if (num > 100000000) return `${Math.trunc(num / 10000000) / 10}亿`
  if (num > 10000) return `${Math.trunc(num / 1000) / 10}万`
  return String(num)
}

export { toMD5 } from './musicSdk/utils'

export const dateFormat2 = (time: number): string => {
  const differ = Math.trunc((Date.now() - time) / 1000)
  if (differ < 60) return `${differ} 秒前`
  if (differ < 3600) return `${Math.trunc(differ / 60)} 分钟前`
  if (differ < 86400) return `${Math.trunc(differ / 3600)} 小时前`
  return new Date(time).toLocaleDateString()
}

