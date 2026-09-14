import { Buffer } from 'buffer'

async function inflateAsync(buffer: Uint8Array): Promise<Buffer> {
  if (typeof DecompressionStream !== 'undefined') {
    try {
      const ds = new DecompressionStream('deflate')
      const writer = ds.writable.getWriter()
      writer.write(buffer as any)
      writer.close()
      const reader = ds.readable.getReader()
      const chunks: Uint8Array[] = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }
      return Buffer.concat(chunks.map(c => Buffer.from(c)))
    } catch {
      // Fallback
    }
  }
  return Buffer.from(buffer)
}

export const inflate = (
  data: Uint8Array | Buffer,
  callback: (err: Error | null, result?: Buffer) => void,
) => {
  inflateAsync(data)
    .then(res => callback(null, res))
    .catch(err => callback(err instanceof Error ? err : new Error(String(err))))
}

export default {
  inflate,
}
