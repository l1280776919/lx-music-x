export function httpFetch(url: string, options: any = {}) {
  let cancelled = false
  const promise = Promise.resolve().then(() => {
    if (cancelled) throw new Error('请求已取消')
    // Preserve the exact byte order used by platform request signatures.
    const nativeOptions = { ...options, headers: { ...options.headers } }
    if (options.json !== undefined) {
      nativeOptions.body = JSON.stringify(options.json)
      delete nativeOptions.json
      nativeOptions.headers['Content-Type'] = 'application/json'
    } else if (options.body && typeof options.body === 'object') {
      nativeOptions.body = JSON.stringify(options.body)
      nativeOptions.headers['Content-Type'] ||= 'application/json'
    }
    const result = JSON.parse((globalThis as any).__http(url, JSON.stringify(nativeOptions)))
    if (result.error) throw new Error(result.error)
    return result
  })
  return { promise, cancelHttp: () => { cancelled = true } }
}
export const httpGet = (url: string, options: any, callback?: any) => {
  if (typeof options === 'function') { callback = options; options = {} }
  const r = httpFetch(url, { ...options, method: 'GET' })
  r.promise.then(res => callback?.(null, res, res.body), err => callback?.(err, null, null))
  return r
}
export const httpPost = (url: string, data: any, options: any, callback: any) => {
  const r = httpFetch(url, { ...options, method: 'POST', body: data })
  r.promise.then(res => callback?.(null, res, res.body), err => callback?.(err, null, null))
  return r
}
export default { httpFetch, httpGet, httpPost }
