import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { isTauri } from '@/core/tauriBridge'

const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

/**
 * 现代 Tauri 2 原生 HTTP 网络适配层
 */
export const httpFetch = (url, options = {}) => {
  let isCancelled = false
  const controller = new AbortController()

  const promise = (async () => {
    const method = (options.method || 'GET').toUpperCase()
    const headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    }

    let body = undefined
    if (options.form) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      body = new URLSearchParams(options.form).toString()
    } else if (options.formData) {
      body = options.formData
    } else if (options.body) {
      body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
    }

    const fetchImpl = isTauri() ? tauriFetch : (typeof window !== 'undefined' ? window.fetch.bind(window) : globalThis.fetch)

    try {
      const resp = await fetchImpl(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      })

      const text = await resp.text()
      let parsedBody = text
      try {
        parsedBody = JSON.parse(text)
      } catch (_) {}

      return {
        statusCode: resp.status,
        body: parsedBody,
        raw: text,
        headers: resp.headers,
      }
    } catch (err) {
      if (isCancelled) {
        throw new Error('请求已取消')
      }
      throw err
    }
  })()

  return {
    promise,
    cancelHttp: () => {
      isCancelled = true
      controller.abort()
    },
  }
}

export const httpGet = (url, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  const req = httpFetch(url, { ...options, method: 'GET' })
  req.promise.then(res => callback(null, res, res.body)).catch(err => callback(err, null, null))
  return req
}

export const httpPost = (url, data, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  const req = httpFetch(url, { ...options, method: 'POST', body: data })
  req.promise.then(res => callback(null, res, res.body)).catch(err => callback(err, null, null))
  return req
}

export default {
  httpFetch,
  httpGet,
  httpPost,
}
