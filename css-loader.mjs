import fs from 'node:fs'

export async function load(url, context, nextLoad) {
  if (url.endsWith('.scss')) {
    const content = fs.readFileSync(new URL(url), { encoding: "utf-8" });
    const classNamesMap = [...content.matchAll(/\.[\w\d]+ {/g)]
      .map(([fromCss]) => fromCss.substring(1, fromCss.length - 2))
      .reduce((prev, next) => ({
        ...prev,
        [next]: next
      }), {})
    return {
      format: "json",
      shortCircuit: true,
      source: JSON.stringify(classNamesMap)
    }
  }
  return nextLoad(url);
}
