import { Meta } from '@cucumber/messages'

export function makeSetupString(meta: Meta): string {
  const parts = []
  if (meta.implementation) {
    let implementation = `Implementation: ${meta.implementation.name}`
    if (meta.implementation.version) {
      implementation += `@${meta.implementation.version}`
    }
    parts.push(implementation)
  }
  if (meta.runtime) {
    let runtime = `Runtime: ${meta.runtime.name}`
    if (meta.runtime.version) {
      runtime += `@${meta.runtime.version}`
    }
    parts.push(runtime)
  }
  if (meta.os) {
    let os = `Platform: ${meta.os.name}`
    if (meta.os.version) {
      os += `@${meta.os.version}`
    }
    parts.push(os)
  }
  return parts.join('\n')
}
