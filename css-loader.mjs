import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.scss')) {
    const url = new URL(specifier, context.parentURL)
    const content = fs.readFileSync(fileURLToPath(url), { encoding: 'utf-8' })
    const classNamesMap = [...content.matchAll(/\.[\w\d]+ {/g)]
      .map(([fromCss]) => fromCss.substring(1, fromCss.length - 2))
      .reduce((prev, next) => Object.assign(prev, { [next]: next }), {})
    const source = `export default ${JSON.stringify(classNamesMap)}`
    return {
      shortCircuit: true,
      url: `data:text/javascript,${encodeURIComponent(source)}`,
    }
  }
  return nextResolve(specifier, context)
}
