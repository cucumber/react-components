import * as messages from '@cucumber/messages'
import { AttachmentContentEncoding } from '@cucumber/messages'
import { render, screen } from '@testing-library/react'
import { expect } from 'chai'

import { Attachment } from './Attachment.js'

describe('<Attachment>', () => {
  it('renders a download button for a file that isnt video, image or text', () => {
    const attachment: messages.Attachment = {
      body: 'test content',
      mediaType: 'application/pdf',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
      fileName: 'document.pdf',
    }
    render(<Attachment attachment={attachment} />)

    expect(screen.getByRole('button', { name: 'Download document.pdf' })).to.be.visible
  })

  it('renders a download button for an unknown externalised attachment', () => {
    const attachment: messages.Attachment = {
      body: '',
      mediaType: 'application/pdf',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
      fileName: 'document.pdf',
    }
    render(<Attachment attachment={attachment} />)

    expect(screen.getByRole('button', { name: 'Download document.pdf' })).to.be.visible
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
    expect(summary).to.have.text('Attached Video (video/mp4)')
    expect(video).to.have.attr('src', 'data:video/mp4;base64,fake-base64')
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
    expect(summary).to.have.text('the attachment name')
    expect(video).to.have.attr('src', 'data:video/mp4;base64,fake-base64')
  })

  it('renders an externalised video', () => {
    const attachment: messages.Attachment = {
      mediaType: 'video/mp4',
      body: '',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
      url: './path-to-video.mp4',
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const video = container.querySelector('video source')
    expect(summary).to.have.text('Attached Video (video/mp4)')
    expect(video).to.have.attr('src', './path-to-video.mp4')
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
    expect(summary).to.have.text('Attached Image (image/png)')
    expect(img).to.have.attr('src', 'data:image/png;base64,fake-base64')
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
    expect(summary).to.have.text('the attachment name')
    expect(img).to.have.attr('src', 'data:image/png;base64,fake-base64')
  })

  it('renders an externalised image ', () => {
    const attachment: messages.Attachment = {
      mediaType: 'image/png',
      body: '',
      contentEncoding: AttachmentContentEncoding.IDENTITY,
      url: './path-to-image.png',
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const summary = container.querySelector('details summary')
    const img = container.querySelector('img')
    expect(summary).to.have.text('Attached Image (image/png)')
    expect(img).to.have.attr('src', './path-to-image.png')
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
    expect(summary).to.have.text('Attached Text (text/plain)')
    expect(data).to.have.text('hello')
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
    expect(summary).to.have.text('the attachment name')
    expect(data).to.have.text('hello')
  })

  it('correctly renders ANSI characters', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/x.cucumber.log+plain',
      body: '\x1b[30mblack\x1b[37mwhite',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
    }
    const { container } = render(<Attachment attachment={attachment} />)
    const data = container.querySelector('pre > span')
    expect(data).to.contain.html(
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
    const data = container.querySelector('pre > span')
    expect(data).to.contain.html(
      '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
    )
  })

  it('renders a link', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/uri-list',
      contentEncoding: AttachmentContentEncoding.IDENTITY,
      body: 'https://cucumber.io',
    }

    render(<Attachment attachment={attachment} />)

    const link = screen.getByRole('link', { name: 'https://cucumber.io' })
    expect(link).to.be.visible
    expect(link).to.have.attr('href', 'https://cucumber.io')
    expect(link).to.have.attr('target', '_blank')
    expect(link).to.have.attr('rel', 'noopener nofollow noreferrer')
  })

  it('renders multiple links and ignores blank lines', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/uri-list',
      contentEncoding: AttachmentContentEncoding.IDENTITY,
      body: `https://github.com/cucumber/cucumber-js
https://github.com/cucumber/cucumber-jvm
https://github.com/cucumber/cucumber-ruby
`,
    }

    render(<Attachment attachment={attachment} />)

    expect(screen.getAllByRole('link').length).to.eq(3)
    expect(screen.getByRole('link', { name: 'https://github.com/cucumber/cucumber-js' })).to.be
      .visible
    expect(screen.getByRole('link', { name: 'https://github.com/cucumber/cucumber-jvm' })).to.be
      .visible
    expect(screen.getByRole('link', { name: 'https://github.com/cucumber/cucumber-ruby' })).to.be
      .visible
  })

  it('renders a fallback when the attachment cannot be rendered', () => {
    const attachment: messages.Attachment = {
      mediaType: 'text/plain',
      body: 'this is not valid base64!!!',
      contentEncoding: messages.AttachmentContentEncoding.BASE64,
    }
    render(<Attachment attachment={attachment} />)

    expect(screen.getByText("Attachment couldn't be rendered")).to.be.visible
  })
})
