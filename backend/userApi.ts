import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'
import { httpFetch } from './request'
import { createCipheriv } from './shims/crypto'
import { inflate } from './shims/zlib'
const handlers = new Map<string, Function>()
let initialized: any = null
export const userApiManager = {
  nativeRequest: (url: string, options: any = {}) => httpFetch(url, options).promise,
  async loadScript(rawCode: string) {
    handlers.clear()
    initialized = null
    const lx = {
      EVENT_NAMES: { request: 'request', inited: 'inited', updateAlert: 'updateAlert' },
      env: 'desktop', version: '2.0.0',
      currentScriptInfo: { name: 'UserAPI', rawScript: rawCode },
      on(event: string, handler: Function) { handlers.set(event, handler); return Promise.resolve() },
      send(event: string, data: any) {
        if (event === 'inited') initialized = data
        return Promise.resolve()
      },
      request(url: string, options: any, callback?: Function) {
        if (typeof options === 'function') { callback = options; options = {} }
        const req = httpFetch(url, options)
        req.promise.then(res => callback?.(null, res, res.body), err => callback?.(err, null, null))
        return req.cancelHttp
      },
      utils: {
        zlib: { inflate: (buf: Uint8Array) => new Promise((resolve, reject) => inflate(buf, (err, data) => err ? reject(err) : resolve(data))) },
        buffer: { from: (...args: any[]) => (Buffer as any).from(...args), bufToString: (b: any, f: any) => Buffer.from(b).toString(f) },
        crypto: {
          md5: (s: any) => CryptoJS.MD5(typeof s === 'string' ? s : CryptoJS.lib.WordArray.create(s)).toString(),
          randomBytes: (n: number) => Buffer.from(JSON.parse((globalThis as any).__random(n))),
          aesEncrypt(data: any, mode: string, key: any, iv: any) {
            const cipher = createCipheriv(mode, key, iv)
            return Buffer.concat([cipher.update(Buffer.from(data)), cipher.final()])
          },
          rsaEncrypt(data: any, key: string) {
            const result = JSON.parse((globalThis as any).__rsa(JSON.stringify(Array.from(Buffer.from(data))), key))
            if (result.error) throw new Error(result.error)
            return Buffer.from(result.bytes)
          },
        },
      },
    }
    Object.assign(globalThis, { lx, Buffer })
    new Function('lx', 'Buffer', rawCode)(lx, Buffer)
    // Flush initialization jobs before checking the source declaration.
    for (let i = 0; i < 10 && initialized === null; i++) await Promise.resolve()
    if (initialized?.status === false) throw new Error(initialized.message || '音源初始化失败')
    if (!handlers.has('request')) throw new Error('音源未注册 request 处理器')
    return true
  },
  async invokeSource(action: string, data: any) {
    const handler = handlers.get('request')
    if (!handler) return null
    return handler({ source: data.source || 'wy', action, info: { ...data, type: data.type || '128k', musicInfo: data.songInfo || data.musicInfo || data } })
  },
}
