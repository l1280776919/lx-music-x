import { Buffer } from 'buffer'
export function inflate(data: Uint8Array, callback: (err: Error | null, result?: Buffer) => void) {
  try {
    const result = JSON.parse((globalThis as any).__inflate(JSON.stringify(Array.from(data))))
    if (result.error) throw new Error(result.error)
    callback(null, Buffer.from(result.bytes))
  } catch (e) { callback(e instanceof Error ? e : new Error(String(e))) }
}
export default { inflate }
