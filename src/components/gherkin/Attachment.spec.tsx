import * as messages from '@cucumber/messages'
import React from 'react'

import { render, screen } from '../../../test-utils'
import { Attachment } from './Attachment'

describe('<Attachment>', () => {
  it('renders a download button for a file that isnt video, image or text', () => {
    const attachment: messages.Attachment = {
      body: 'test content',
      mediaType: 'application/pdf',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
      fileName: 'document.pdf',
    }
    render(<Attachment attachment={attachment} />)

    expect(screen.getByRole('button', { name: 'Download document.pdf' })).toBeVisible()
  })

  it('renders a video', () => {
    const attachment: messages.Attachment = {
      mediaType: 'video/mp4',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const video = container.querySelector('video source')
    expect(summary).toHaveTextContent('Attached Video (video/mp4)')
    expect(video).toHaveAttribute('src', 'data:video/mp4;base64,fake-base64')
  })

  it('renders a video with a name', () => {
    const attachment: messages.Attachment = {
      mediaType: 'video/mp4',
      fileName: 'the attachment name',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const video = container.querySelector('video source')
    expect(summary).toHaveTextContent('the attachment name')
    expect(video).toHaveAttribute('src', 'data:video/mp4;base64,fake-base64')
  })

  it('renders an image', () => {
    const attachment: messages.Attachment = {
      mediaType: 'image/png',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const img = container.querySelector('img')
    expect(summary).toHaveTextContent('Attached Image (image/png)')
    expect(img).toHaveAttribute('src', 'data:image/png;base64,fake-base64')
  })

  it('renders an image with a name', () => {
    const attachment: messages.Attachment = {
      mediaType: 'image/png',
      fileName: 'the attachment name',
      body: 'fake-base64',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const img = container.querySelector('img')
    expect(summary).toHaveTextContent('the attachment name')
    expect(img).toHaveAttribute('src', 'data:image/png;base64,fake-base64')
  })

  it('renders base64 encoded plaintext', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/plain',
      body: Buffer.from('hello').toString('base64'),
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const data = container.querySelector('details pre')
    expect(summary).toHaveTextContent('Attached Text (text/plain)')
    expect(data).toHaveTextContent('hello')
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
    expect(summary).toHaveTextContent('the attachment name')
    expect(data).toHaveTextContent('hello')
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
    expect(summary).toHaveTextContent('Attached Text (text/x.cucumber.log+plain)')
    expect(data).toContainHTML(
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
    expect(summary).toHaveTextContent('the attachment name')
    expect(data).toContainHTML(
      '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
    )
  })
})
