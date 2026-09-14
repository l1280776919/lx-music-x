import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { isTauri } from '@/core/tauriBridge'

export interface UserApiScriptMeta {
  id: string
  name: string
  version: string
  author: string
  description?: string
  rawCode: string
  enabled: boolean
}

export interface UserApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  form?: Record<string, any>
  json?: any
  timeout?: number
}

type UserApiHandler = (action: string, data: any) => Promise<any> | any

class UserApiManager {
  private activeScript: UserApiScriptMeta | null = null
  private handlers: Map<string, UserApiHandler> = new Map()

  constructor() {
    // 预置默认内置源
    this.activeScript = {
      id: 'default-source',
      name: '官方内置源 (聚合)',
      version: '1.0.0',
      author: 'LX Music Team',
      description: '提供主流开源与免版权高品质试听音源',
      rawCode: '',
      enabled: true,
    }
  }

  public getActiveScript(): UserApiScriptMeta | null {
    return this.activeScript
  }

  /**
   * 核心网络请求函数 (通过 Tauri 原生 HTTP 绕过 CORS 并支持自定义 Header)
   */
  public async nativeRequest(url: string, options: UserApiRequestOptions = {}): Promise<any> {
    const method = options.method || 'GET'
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...(options.headers || {}),
    }

    let body: any = undefined
    if (options.json) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(options.json)
    } else if (options.body) {
      body = options.body
    }

    if (isTauri()) {
      // 在 Tauri 客户端中调用原生 HTTP 请求，无同源策略限制
      const response = await tauriFetch(url, {
        method,
        headers,
        body,
      })

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return await response.json()
      }
      return await response.text()
    } else {
      // Web 开发环境回退
      console.log(`[UserApi Web Mock] Request: ${method} ${url}`)
      return { code: 0, msg: 'ok', data: [] }
    }
  }

  /**
   * 加载并执行自定义 JavaScript 音源脚本
   */
  public async loadScript(rawCode: string): Promise<UserApiScriptMeta> {
    // 简易解析脚本元信息 (如 // @name, // @version 等)
    const nameMatch = rawCode.match(/@name\s+(.+)/)
    const authorMatch = rawCode.match(/@author\s+(.+)/)
    const versionMatch = rawCode.match(/@version\s+(.+)/)
    const descMatch = rawCode.match(/@description\s+(.+)/)

    const meta: UserApiScriptMeta = {
      id: `user-api-${Date.now()}`,
      name: nameMatch ? nameMatch[1].trim() : '自定义音源脚本',
      version: versionMatch ? versionMatch[1].trim() : '1.0.0',
      author: authorMatch ? authorMatch[1].trim() : '社区开发者',
      description: descMatch ? descMatch[1].trim() : '用户导入的外部自定义源',
      rawCode,
      enabled: true,
    }

    // 构建沙箱上下文注入
    const context = {
      lx: {
        request: this.nativeRequest.bind(this),
        on: (event: string, handler: UserApiHandler) => {
          this.handlers.set(event, handler)
        },
        send: (event: string, data: any) => {
          console.log(`[UserApi Script Event] ${event}:`, data)
        },
        version: '2.0.0',
      },
      console,
    }

    try {
      // 在闭包隔离作用域中执行
      const sandboxFn = new Function('lx', 'console', rawCode)
      sandboxFn(context.lx, context.console)
      this.activeScript = meta
      return meta
    } catch (err) {
      console.error('Failed to load user api script:', err)
      throw new Error(`音源脚本解析失败: ${err}`)
    }
  }

  /**
   * 触发自定义音源调用 (如搜索、获取歌曲播放直链等)
   */
  public async invokeSource(action: string, data: any): Promise<any> {
    const handler = this.handlers.get(action)
    if (handler) {
      return await handler(action, data)
    }
    console.warn(`No handler registered for action: ${action}`)
    return null
  }
}

export const userApiManager = new UserApiManager()
