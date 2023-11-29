const glob = require('glob')
const fs = require('fs')
const path = require('path')

if (fs.existsSync('acceptance')) {
  fs.rmdirSync('acceptance', { recursive: true })
}

for (const ndjsonPath of glob.sync(
  'node_modules/@cucumber/compatibility-kit/features/**/*.ndjson'
)) {
  const filename = path.basename(ndjsonPath)
  const [suiteName, ...suffixes] = filename.split('.')
  const content = fs.readFileSync(ndjsonPath, { encoding: 'utf-8' })
  const asTs = `// Generated file. Do not edit.
export default [${content.split('\n').join(',')}]
`
  const targetPath = `acceptance/${suiteName}/${suiteName}.${suffixes
    .filter((s) => s !== 'ndjson')
    .join('.')}.ts`
  fs.mkdirSync(`acceptance/${suiteName}`, { recursive: true })
  fs.writeFileSync(targetPath, asTs, { encoding: 'utf-8' })
}
