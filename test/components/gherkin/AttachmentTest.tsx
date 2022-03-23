import * as messages from '@cucumber/messages'
import assert from 'assert'
import React from 'react'

import { Attachment } from '../../../src/components/gherkin'
import { render } from '../utils'

describe('<Attachment>', () => {
  it('renders an image', () => {
    const binary = new Uint8Array(10)
    binary.fill(255, 0, binary.length)
    const attachment: messages.Attachment = {
      mediaType: 'image/png',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const img = container.querySelector('img')
    assert.strictEqual(img!.getAttribute('src'), 'data:image/png;base64,fake-base64')
  })

  it('renders base64 encoded plaintext', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/plain',
      body: Buffer.from('hello').toString('base64'),
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('pre details summary')
    const details = container.querySelector('pre details span')
    assert.strictEqual(summary!.textContent, 'text')
    assert.strictEqual(details!.textContent, 'hello')
  })

  it('renders base64 encoded plaintext with a filename', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/plain',
      fileName: "theFileName",
      body: Buffer.from('hello').toString('base64'),
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('pre details summary')
    const details = container.querySelector('pre details span')
    assert.strictEqual(summary!.textContent, 'theFileName')
    assert.strictEqual(details!.textContent, 'hello')
  })

  it('correctly renders ANSI characters', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/x.cucumber.log+plain',
      body: '\x1b[30mblack\x1b[37mwhite',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const span = container.querySelector('pre > details > span')
    assert.strictEqual(
      span!.innerHTML,
      '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
    )
  })

  it('correctly renders ANSI characters with a filename', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/x.cucumber.log+plain',
      fileName: "theFileName",
      body: '\x1b[30mblack\x1b[37mwhite',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('pre details summary')
    const span = container.querySelector('pre > details > span')
    assert.strictEqual(summary!.textContent, 'theFileName')
    assert.strictEqual(
      span!.innerHTML,
      '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
    )
  })
})
