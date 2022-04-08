import { runCucumber, SupportCode } from '@cucumber/fake-cucumber'
import { GherkinStreams } from '@cucumber/gherkin-streams'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { NdjsonToMessageStream } from '@cucumber/message-streams'
import { IdGenerator } from '@cucumber/messages'
import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import assert from 'assert'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import React from 'react'
import { pipeline, Writable } from 'stream'
import { promisify } from 'util'

import { render } from '../test/components/utils'
import CucumberQueryStream from '../test/CucumberQueryStream'
import { EnvelopesQuery } from './index'
import { components } from './index'

describe('acceptance tests', () => {
  jest.setTimeout(30000)

  describe('with test data', () => {
    const dir = __dirname + '/../testdata/good'
    const files = fs.readdirSync(dir)

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

  describe('with user-provided and compatibility kit data', () => {
    const localMessageFiles = glob.sync(`test/messages/**/*.ndjson`, {
      cwd: path.resolve(__dirname, '..'),
    })
    assert.ok(localMessageFiles.length, 'Expected to find some files to test with')
    const cckMessageFiles = glob.sync(
      `node_modules/@cucumber/compatibility-kit/features/**/*.ndjson`
    )
    assert.ok(cckMessageFiles.length, 'Expected to find some files to test with')
    const messageFiles = [...localMessageFiles, ...cckMessageFiles]

    for (const messageFile of messageFiles) {
      it(`can render ${messageFile}`, async () => {
        const gherkinQuery = new GherkinQuery()
        const cucumberQuery = new CucumberQuery()
        const envelopesQuery = new EnvelopesQuery()

        const messageStream = new NdjsonToMessageStream()

        await promisify(pipeline)(
          fs.createReadStream(messageFile, 'utf-8'),
          messageStream,
          new Writable({
            objectMode: true,
            write(
              envelope: messages.Envelope,
              encoding: string,
              callback: (error?: Error | null) => void
            ) {
              gherkinQuery.update(envelope)
              cucumberQuery.update(envelope)
              envelopesQuery.update(envelope)
              callback()
            },
          })
        )

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
  })
})
