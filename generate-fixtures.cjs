const glob = require('glob')
const fs = require('fs')
const path = require('path')

// Helper function to convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

// Helper function to convert kebab-case to camelCase
function toCamelCase(str) {
  const parts = str.split('-')
  return parts[0] + parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
}

if (fs.existsSync('acceptance')) {
  fs.rmdirSync('acceptance', { recursive: true })
}

// Collect sample names for story generation
const sampleNames = []

for (const ndjsonPath of glob.sync(
  'node_modules/@cucumber/compatibility-kit/features/**/*.ndjson'
)) {
  const filename = path.basename(ndjsonPath)
  const [suiteName] = filename.split('.')
  sampleNames.push(suiteName)

  const content = fs.readFileSync(ndjsonPath, { encoding: 'utf-8' })
  const asTs = `// Generated file. Do not edit.
import { Envelope } from '@cucumber/messages'

export default [${content.split('\n').join(',')}] as ReadonlyArray<Envelope>
`
  const targetPath = `acceptance/${suiteName}/${suiteName}.ts`
  fs.mkdirSync(`acceptance/${suiteName}`, { recursive: true })
  fs.writeFileSync(targetPath, asTs, { encoding: 'utf-8' })
}

// Sort sample names for consistent output
sampleNames.sort()

// Generate GherkinDocument.stories.tsx
const storiesPath = 'src/components/app/Report.stories.tsx'

const imports = sampleNames
  .map(name => `import ${toCamelCase(name)}Sample from '../../../acceptance/${name}/${name}.js'`)
  .join('\n')

const stories = sampleNames
  .map(name => {
    const exportName = toPascalCase(name)
    const importName = toCamelCase(name) + 'Sample'
    return `export const ${exportName} = Template.bind({})
${exportName}.args = {
  envelopes: ${importName},
}`
  })
  .join('\n\n')

const storiesTemplate = `// Generated file. Do not edit.
import { Envelope } from '@cucumber/messages'
import { Story } from '@ladle/react'
import React from 'react'

${imports}
import { EnvelopesProvider } from './EnvelopesProvider.js'
import { Report } from './Report.js'

export default {
  title: 'App/Report',
}

type TemplateArgs = {
  envelopes: Envelope[]
}

const Template: Story<TemplateArgs> = ({ envelopes }) => {
  return (
    <EnvelopesProvider envelopes={envelopes}>
      <Report />
    </EnvelopesProvider>
  )
}

${stories}
`

fs.writeFileSync(storiesPath, storiesTemplate, { encoding: 'utf-8' })
