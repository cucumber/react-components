import { NdjsonToMessageStream } from '@cucumber/message-streams'
import * as messages from '@cucumber/messages'
import { Envelope } from '@cucumber/messages'
import assert from 'assert'
import { expect } from 'chai'
import fs from 'fs'
import glob from 'glob'
import React from 'react'
import { pipeline, Writable } from 'stream'
import { promisify } from 'util'

import { render } from '../test-utils/index.js'
import { EnvelopesProvider, FilteredDocuments } from './index.js'

describe('acceptance tests', function () {
  this.timeout('30s')

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
        const envelopes: Array<Envelope> = []
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
              envelopes.push(envelope)
              callback()
            },
          })
        )

        const { container } = render(
          <EnvelopesProvider envelopes={envelopes}>
            <FilteredDocuments/>
          </EnvelopesProvider>
        )

        expect(container.textContent).not.to.eq(null)
      })
    }
  })
})
