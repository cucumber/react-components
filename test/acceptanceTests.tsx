import { runCucumber, SupportCode } from '@cucumber/fake-cucumber'
import { GherkinStreams } from '@cucumber/gherkin-streams'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'
import React from 'react'
import ReactDOM from 'react-dom'

import { EnvelopesQuery } from '../src'
import { components } from '../src'
import CucumberQueryStream from './CucumberQueryStream'

describe('App', () => {
  const dir = __dirname + '/../testdata/good'
  const files = fs.readdirSync(dir)

  for (const file of files) {
    if (file.match(/\.feature$/)) {
      it(`can render ${file}`, async () => {
        const dom = new JSDOM('<html lang="en"><body><div id="content"></div></body></html>')
        // @ts-ignore
        global.window = dom.window
        // global.navigator = dom.window.navigator
        const document = dom.window.document

        const supportCode = new SupportCode()
        const p = path.join(dir, file)
        const gherkinStream = GherkinStreams.fromPaths([p], {
          newId: IdGenerator.incrementing(),
        })
        const gherkinQuery = new GherkinQuery()
        const cucumberQuery = new CucumberQuery()
        const envelopesQuery = new EnvelopesQuery()

        const cucumberQueryStream = new CucumberQueryStream(cucumberQuery)
        await runCucumber(supportCode, gherkinStream, gherkinQuery, cucumberQueryStream)
        const app = (
          <components.app.QueriesWrapper
            gherkinQuery={gherkinQuery}
            cucumberQuery={cucumberQuery}
            envelopesQuery={envelopesQuery}
          >
            <components.app.GherkinDocumentList
              gherkinDocuments={gherkinQuery.getGherkinDocuments()}
            />
          </components.app.QueriesWrapper>
        )
        ReactDOM.render(app, document.getElementById('content'))
      }).timeout(10000)
    }
  }
})
