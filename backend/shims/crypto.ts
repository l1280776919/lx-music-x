import md5 from 'crypto-js/md5'
import sha1 from 'crypto-js/sha1'
import aes from 'crypto-js/aes'
import CryptoJS from 'crypto-js/core'
import encHex from 'crypto-js/enc-hex'
import modeEcb from 'crypto-js/mode-ecb'
import padPkcs7 from 'crypto-js/pad-pkcs7'
import WordArray from 'crypto-js/lib-typedarrays'
import { Buffer } from 'buffer'

const bufferToWordArray = (buffer: Buffer | Uint8Array) => WordArray.create(new Uint8Array(buffer) as any)

const wordArrayToBuffer = (wordArray: any) => Buffer.from(wordArray.toString(encHex), 'hex')

export const createHash = (algorithm: string) => {
  const chunks: Buffer[] = []

  return {
    update(input: string | Buffer) {
      chunks.push(typeof input === 'string' ? Buffer.from(input) : Buffer.from(input))
      return this
    },
    digest(_encoding = 'hex') {
      if (algorithm.toLowerCase() === 'md5') {
        return md5(bufferToWordArray(Buffer.concat(chunks))).toString()
      }
      if (algorithm.toLowerCase() === 'sha1') {
        return sha1(bufferToWordArray(Buffer.concat(chunks))).toString()
      }
      throw new Error(`crypto.createHash(${algorithm}) is not implemented`)
    },
  }
}

const aesOptions = (algorithm: string, iv: Buffer | string) => ({
  mode: algorithm.includes('ecb') ? modeEcb : (CryptoJS.mode as any).CBC,
  padding: padPkcs7,
  iv: typeof iv === 'string' ? undefined : bufferToWordArray(typeof iv === 'string' ? Buffer.from(iv) : iv),
})

export const createCipheriv = (algorithm: string, key: Buffer | string, iv: Buffer | string) => {
  const chunks: Buffer[] = []

  return {
    update(input: Buffer) {
      chunks.push(Buffer.from(input))
      return Buffer.alloc(0)
    },
    final() {
      const data = Buffer.concat(chunks)
      const keyBuf = typeof key === 'string' ? Buffer.from(key) : key
      const encrypted = aes.encrypt(bufferToWordArray(data), bufferToWordArray(keyBuf), aesOptions(algorithm, iv))
      return wordArrayToBuffer(encrypted.ciphertext)
    },
  }
}

export const createDecipheriv = (algorithm: string, key: Buffer | string, iv: Buffer | string) => {
  const chunks: Buffer[] = []

  return {
    update(input: Buffer) {
      chunks.push(Buffer.from(input))
      return Buffer.alloc(0)
    },
    final() {
      const data = Buffer.concat(chunks)
      const keyBuf = typeof key === 'string' ? Buffer.from(key) : key
      const decrypted = aes.decrypt({ ciphertext: bufferToWordArray(data) } as any, bufferToWordArray(keyBuf), aesOptions(algorithm, iv))
      return wordArrayToBuffer(decrypted)
    },
  }
}

export const randomBytes = (size: number) => {
  const data = new Uint8Array(size)
  globalThis.crypto?.getRandomValues(data)
  return Buffer.from(data)
}

export const constants = {
  RSA_NO_PADDING: 3,
}

// NetEase weapi RSA public key modulus (n) and exponent (e)
const RSA_N_HEX = 'e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
const RSA_E = 65537n

export const publicEncrypt = ({ key: _key, padding: _padding }: { key: string; padding: number }, buffer: Buffer): Buffer => {
  const n = BigInt('0x' + RSA_N_HEX)
  const e = RSA_E
  const padded = Buffer.alloc(128)
  buffer.copy(padded, 128 - buffer.length)
  const m = BigInt('0x' + padded.toString('hex'))
  let base = m % n, power = e, c = 1n
  while (power > 0n) {
    if (power & 1n) c = c * base % n
    base = base * base % n
    power >>= 1n
  }
  const cHex = c.toString(16).padStart(256, '0')
  return Buffer.from(cHex, 'hex')
}

export default {
  createHash,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  publicEncrypt,
  constants,
}
