export function base64DecodeText(body: string): string {
  // Properly decode base64 to UTF-8 string
  return new TextDecoder('utf-8').decode(Uint8Array.from(atob(body), (c) => c.charCodeAt(0)))
}

export function base64DecodeBytes(body: string): Uint8Array<ArrayBuffer> {
  // Decode base64 to raw bytes without any text encoding conversion,
  // preserving byte-for-byte accuracy needed for binary content.
  // Uses an explicit ArrayBuffer (not ArrayBufferLike) so the result is
  // directly usable as a BlobPart in File/Blob construction.
  const binary = atob(body)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
