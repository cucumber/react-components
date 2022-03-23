import * as messages from '@cucumber/messages'
import assert from 'assert'
import React from 'react'

import { Attachment } from '../../../src/components/gherkin'
import { render } from '../utils'

describe('<Attachment>', () => {
  it('renders a video', () => {
    const binary = new Uint8Array(10)
    binary.fill(255, 0, binary.length)
    const attachment: messages.Attachment = {
      mediaType: 'video/mp4',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const video = container.querySelector('video source')
    assert.strictEqual(summary!.textContent, 'Attached Video')
    assert.strictEqual(video!.getAttribute('src'), 'data:video/mp4;base64,fake-base64')
  })

  it('renders a video with a name', () => {
    const binary = new Uint8Array(10)
    binary.fill(255, 0, binary.length)
    const attachment: messages.Attachment = {
      mediaType: 'video/mp4',
      fileName: 'the attachment name',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const video = container.querySelector('video source')
    assert.strictEqual(summary!.textContent, 'the attachment name')
    assert.strictEqual(video!.getAttribute('src'), 'data:video/mp4;base64,fake-base64')
  })

  it('renders an image', () => {
    const binary = new Uint8Array(10)
    binary.fill(255, 0, binary.length)
    const attachment: messages.Attachment = {
      mediaType: 'image/png',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const img = container.querySelector('img')
    assert.strictEqual(summary!.textContent, 'Attached Image')
    assert.strictEqual(img!.getAttribute('src'), 'data:image/png;base64,fake-base64')
  })

  it('renders an image with a name', () => {
    const binary = new Uint8Array(10)
    binary.fill(255, 0, binary.length)
    const attachment: messages.Attachment = {
      mediaType: 'image/png',
      fileName: 'the attachment name',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const img = container.querySelector('img')
    assert.strictEqual(summary!.textContent, 'the attachment name')
    assert.strictEqual(img!.getAttribute('src'), 'data:image/png;base64,fake-base64')
  })

  it('renders base64 encoded plaintext', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/plain',
      body: Buffer.from('hello').toString('base64'),
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const data = container.querySelector('details pre span')
    assert.strictEqual(summary!.textContent, 'Attached Text')
    assert.strictEqual(data!.textContent, 'hello')
  })

  it('renders base64 encoded plaintext with a name', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/plain',
      fileName: 'the attachment name',
      body: Buffer.from('hello').toString('base64'),
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const data = container.querySelector('details pre span')
    assert.strictEqual(summary!.textContent, 'the attachment name')
    assert.strictEqual(data!.textContent, 'hello')
  })

  it('correctly renders ANSI characters', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/x.cucumber.log+plain',
      body: '\x1b[30mblack\x1b[37mwhite',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const data = container.querySelector('details > pre > span')
    assert.strictEqual(summary!.textContent, 'Attached Text')
    assert.strictEqual(
      data!.innerHTML,
      '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
    )
  })

  it('correctly renders ANSI characters with a name', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/x.cucumber.log+plain',
      fileName: 'the attachment name',
      body: '\x1b[30mblack\x1b[37mwhite',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const data = container.querySelector('details > pre > span')
    assert.strictEqual(summary!.textContent, 'the attachment name')
    assert.strictEqual(
      data!.innerHTML,
      '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
    )
  })
})
