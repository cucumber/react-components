import { runCucumber, SupportCode } from '@cucumber/fake-cucumber'
import { GherkinStreams } from '@cucumber/gherkin-streams'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import fs from 'fs'
import path from 'path'
import React from 'react'

import { render } from '../test/components/utils'
import CucumberQueryStream from '../test/CucumberQueryStream'
import { EnvelopesQuery } from './index'
import { components } from './index'

describe('App', () => {
  const dir = __dirname + '/../testdata/good'
  const files = fs.readdirSync(dir)

  jest.setTimeout(10000)

  for (const file of files) {
    if (file.match(/\.feature$/)) {
      it(`can render ${file}`, async () => {
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
        render(
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
      })
    }
  }
})
