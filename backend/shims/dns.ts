export const lookup = (
  hostname: string,
  options: unknown,
  callback?: (error: Error | null, address: string, family: number) => void,
) => {
  const cb = typeof options === 'function' ? options : callback
  if (typeof cb !== 'function') return
  cb(null, hostname, 4)
}

export default {
  lookup,
}
