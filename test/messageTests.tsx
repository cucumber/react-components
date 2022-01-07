import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { NdjsonToMessageStream } from '@cucumber/message-streams'
import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import fs from 'fs'
import glob from 'glob'
import { JSDOM } from 'jsdom'
import React from 'react'
import ReactDOM from 'react-dom'
import { pipeline, Writable } from 'stream'
import { promisify } from 'util'

import { components, EnvelopesQuery } from '../src'

const asyncPipeline = promisify(pipeline)

describe('App with messages', () => {
  const localMessageFiles = glob.sync(`${__dirname}/messages/**/*.ndjson`)
  const tckMessageFiles = glob.sync(
    `${__dirname}/../../../compatibility-kit/javascript/features/**/*.ndjson`
  )
  const messageFiles = [...localMessageFiles, ...tckMessageFiles]

  for (const messageFile of messageFiles) {
    it(`can render ${messageFile}`, async () => {
      const dom = new JSDOM('<html lang="en"><body><div id="content"></div></body></html>')
      // @ts-ignore
      global.window = dom.window
      // global.navigator = dom.window.navigator
      const document = dom.window.document

      const gherkinQuery = new GherkinQuery()
      const cucumberQuery = new CucumberQuery()
      const envelopesQuery = new EnvelopesQuery()

      const messageStream = new NdjsonToMessageStream()

      await asyncPipeline(
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
    }).timeout(30000)
  }
})
