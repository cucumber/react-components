import * as url from 'node:url'

import { runCucumber, SupportCode } from '@cucumber/fake-cucumber'
import { GherkinStreams } from '@cucumber/gherkin-streams'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { NdjsonToMessageStream } from '@cucumber/message-streams'
import * as messages from '@cucumber/messages'
import { IdGenerator } from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import assert from 'assert'
import { expect } from 'chai'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import React from 'react'
import { pipeline, Writable } from 'stream'
import { promisify } from 'util'

import { CucumberQueryStream, render } from '../test-utils/index.js'
import { GherkinDocumentList, QueriesProvider } from './index.js'

describe('acceptance tests', function () {
  this.timeout('30s')

  describe('with test data', () => {
    const dir = url.fileURLToPath(new URL('../testdata/good', import.meta.url))
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

          const cucumberQueryStream = new CucumberQueryStream(cucumberQuery)
          await runCucumber(supportCode, gherkinStream, gherkinQuery, cucumberQueryStream)

          const { container } = render(
            <QueriesProvider gherkinQuery={gherkinQuery} cucumberQuery={cucumberQuery}>
              <GherkinDocumentList gherkinDocuments={gherkinQuery.getGherkinDocuments()} />
            </QueriesProvider>
          )

          expect(container.textContent).to.not.eq(null)
        })
      }
    }
  })

  describe('with user-provided and compatibility kit data', () => {
    const localMessageFiles = glob.sync(`test-utils/messages/**/*.ndjson`)
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

        const messageStream = new NdjsonToMessageStream()

        await promisify(pipeline)(
          fs.createReadStream(messageFile, 'utf-8'),
          messageStream,
          new Writable({
            objectMode: true,
            write(
              envelope: messages.Envelope,
              _: string,
              callback: (error?: Error | null) => void
            ) {
              gherkinQuery.update(envelope)
              cucumberQuery.update(envelope)
              callback()
            },
          })
        )

        const { container } = render(
          <QueriesProvider gherkinQuery={gherkinQuery} cucumberQuery={cucumberQuery}>
            <GherkinDocumentList gherkinDocuments={gherkinQuery.getGherkinDocuments()} />
          </QueriesProvider>
        )

        expect(container.textContent).not.to.eq(null)
      })
    }
  })
})
