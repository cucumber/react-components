export function base64Decode(body: string) {
  // Properly decode base64 to UTF-8 string
  return new TextDecoder('utf-8').decode(Uint8Array.from(atob(body), c => c.charCodeAt(0)));
}
