export default function toRepositoryId(remote: string): string {
  let result = remote
  if (!remote.includes('://') && remote.includes(':')) {
    // scp style URL (not really a URL)
    const [host, path] = remote.split(':', 2)
    result = `ssh://${host}/${path}`
  }
  result = result.replace(/\.git$/, '')
  const url = new URL(result)
  return `${url.hostname}${url.pathname}`
}
