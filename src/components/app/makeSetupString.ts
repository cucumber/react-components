import type { Meta, Product } from '@cucumber/messages'

export function makeSetupString(meta: Meta): string {
  const parts = []
  if (meta.implementation) {
    parts.push(makeProductString(meta.implementation, 'Implementation'))
  }
  if (meta.runtime) {
    parts.push(makeProductString(meta.runtime, 'Runtime'))
  }
  if (meta.os) {
    parts.push(makeProductString(meta.os, 'Platform'))
  }
  return parts.join('\n')
}

function makeProductString(product: Product, title: string): string {
  let result = `${title}: ${product.name}`
  if (product.version) {
    result += `@${product.version}`
  }
  return result
}
