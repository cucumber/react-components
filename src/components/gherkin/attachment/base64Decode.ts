export function base64Decode(body: string) {
  // TODO handle unicode
  return atob(body)
}
