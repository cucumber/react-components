import { AttachmentContentEncoding, type Attachment as AttachmentMessage } from '@cucumber/messages'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'chai'
import sinon from 'sinon'

import { Attachment } from './Attachment.js'

describe('<Attachment>', () => {
  const originalClipboard = navigator.clipboard

  before(() => {
    // @ts-expect-error overriding navigator.clipboard
    navigator.clipboard = {
      writeText: sinon.stub().resolves(),
    }
  })

  after(() => {
    // @ts-expect-error overriding navigator.clipboard
    navigator.clipboard = originalClipboard
  })

  beforeEach(() => {
    ;(navigator.clipboard.writeText as sinon.SinonStub).resetHistory()
  })

  describe('download', () => {
    let clickedAnchor: HTMLAnchorElement | undefined

    beforeEach(() => {
      clickedAnchor = undefined
      sinon.stub(HTMLAnchorElement.prototype, 'click').callsFake(function (
        this: HTMLAnchorElement
      ) {
        clickedAnchor = this
      })
    })

    afterEach(() => {
      sinon.restore()
    })

    it('renders a download button for an externalised attachment', () => {
      const attachment: AttachmentMessage = {
        body: '',
        mediaType: 'application/pdf',
        contentEncoding: AttachmentContentEncoding.IDENTITY,
        fileName: 'document.pdf',
        url: './path-to-document.pdf',
      }
      render(<Attachment attachment={attachment} />)

      expect(screen.getByRole('button', { name: 'Download document.pdf' })).to.be.visible
    })

    it('downloads with the correct media type', async () => {
      const attachment: AttachmentMessage = {
        body: Buffer.from('data').toString('base64'),
        mediaType: 'application/pdf',
        contentEncoding: AttachmentContentEncoding.BASE64,
        fileName: 'document.pdf',
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Download document.pdf' }))

      const response = await fetch(clickedAnchor!.href)
      const blob = await response.blob()
      expect(blob.type).to.eq('application/pdf')
    })

    it('downloads IDENTITY text content correctly', async () => {
      const attachment: AttachmentMessage = {
        body: 'hello',
        mediaType: 'application/octet-stream',
        contentEncoding: AttachmentContentEncoding.IDENTITY,
        fileName: 'file.bin',
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Download file.bin' }))

      const response = await fetch(clickedAnchor!.href)
      const text = await response.text()
      expect(text).to.eq('hello')
    })

    it('downloads BASE64 ASCII content with byte accuracy', async () => {
      const original = Buffer.from('hello')
      const attachment: AttachmentMessage = {
        body: original.toString('base64'),
        mediaType: 'application/octet-stream',
        contentEncoding: AttachmentContentEncoding.BASE64,
        fileName: 'file.bin',
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Download file.bin' }))

      const response = await fetch(clickedAnchor!.href)
      const buffer = await response.arrayBuffer()
      expect(Array.from(new Uint8Array(buffer))).to.deep.eq(Array.from(original))
    })

    it('downloads BASE64 binary content with bytes > 127 with byte accuracy', async () => {
      // 0xC3 0xA9 is the UTF-8 encoding of é — as raw binary they must survive byte-for-byte.
      const originalBytes = new Uint8Array([0xc3, 0xa9, 0x00, 0xff, 0x80, 0xfe])
      const attachment: AttachmentMessage = {
        body: Buffer.from(originalBytes).toString('base64'),
        mediaType: 'application/octet-stream',
        contentEncoding: AttachmentContentEncoding.BASE64,
        fileName: 'binary.bin',
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Download binary.bin' }))

      const response = await fetch(clickedAnchor!.href)
      const buffer = await response.arrayBuffer()
      expect(Array.from(new Uint8Array(buffer))).to.deep.eq(Array.from(originalBytes))
    })

    it('does not download when invalid base64 encountered', async () => {
      const attachment: AttachmentMessage = {
        body: 'this is not valid base64!!!',
        mediaType: 'application/octet-stream',
        contentEncoding: AttachmentContentEncoding.BASE64,
        fileName: 'file.bin',
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Download file.bin' }))

      expect(clickedAnchor).to.be.undefined
    })
  })

  describe('video', () => {
    it('renders a video', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'video/mp4',
        body: 'fake-base64',
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const video = container.querySelector('video source')
      expect(summary).to.have.text('Attached Video (video/mp4)')
      expect(video).to.have.attr('src', 'data:video/mp4;base64,fake-base64')
    })

    it('renders a video with a name', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'video/mp4',
        fileName: 'the attachment name',
        body: 'fake-base64',
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const video = container.querySelector('video source')
      expect(summary).to.have.text('the attachment name')
      expect(video).to.have.attr('src', 'data:video/mp4;base64,fake-base64')
    })

    it('renders an externalised video', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'video/mp4',
        body: '',
        contentEncoding: AttachmentContentEncoding.IDENTITY,
        url: './path-to-video.mp4',
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const video = container.querySelector('video source')
      expect(summary).to.have.text('Attached Video (video/mp4)')
      expect(video).to.have.attr('src', './path-to-video.mp4')
    })
  })

  describe('image', () => {
    it('renders an image', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'image/png',
        body: 'fake-base64',
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const img = container.querySelector('img')
      expect(summary).to.have.text('Attached Image (image/png)')
      expect(img).to.have.attr('src', 'data:image/png;base64,fake-base64')
    })

    it('renders an image with a name', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'image/png',
        fileName: 'the attachment name',
        body: 'fake-base64',
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const img = container.querySelector('img')
      expect(summary).to.have.text('the attachment name')
      expect(img).to.have.attr('src', 'data:image/png;base64,fake-base64')
    })

    it('renders an externalised image', () => {
      const attachment: AttachmentMessage = {
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
  })

  describe('text', () => {
    it('renders base64 encoded plaintext', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/plain',
        body: Buffer.from('hello').toString('base64'),
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const data = container.querySelector('details pre')
      expect(summary).to.have.text('Attached Text (text/plain)')
      expect(data).to.have.text('hello')
      expect(screen.getByRole('button', { name: 'Copy' })).to.be.visible
    })

    it('renders base64 encoded plaintext with a name', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/plain',
        fileName: 'the attachment name',
        body: Buffer.from('hello').toString('base64'),
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const data = container.querySelector('details pre span')
      expect(summary).to.have.text('the attachment name')
      expect(data).to.have.text('hello')
    })

    it('copies text content when clicking copy button', async () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/plain',
        body: Buffer.from('hello').toString('base64'),
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

      await waitFor(() => {
        expect(navigator.clipboard.writeText).to.have.been.calledOnceWithExactly('hello')
      })
    })

    it('renders base64 encoded Cyrillic text', () => {
      const cyrillicText = 'СЧА ИРК'
      const attachment: AttachmentMessage = {
        mediaType: 'text/plain',
        body: Buffer.from(cyrillicText, 'utf-8').toString('base64'),
        contentEncoding: AttachmentContentEncoding.BASE64,
        fileName: 'CyrillicAsUTF8.txt',
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const summary = container.querySelector('details summary')
      const data = container.querySelector('details pre span')
      expect(summary).to.have.text('CyrillicAsUTF8.txt')
      expect(data).to.have.text(cyrillicText)
    })

    it('renders base64 encoded emoji text', () => {
      const emojiText = '🥒🌍'
      const attachment: AttachmentMessage = {
        mediaType: 'text/plain',
        body: Buffer.from(emojiText, 'utf-8').toString('base64'),
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const data = container.querySelector('details pre span')
      expect(data).to.have.text(emojiText)
    })

    it('renders a fallback when invalid base64 encountered', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/plain',
        body: 'this is not valid base64!!!',
        contentEncoding: AttachmentContentEncoding.BASE64,
      }
      render(<Attachment attachment={attachment} />)

      expect(screen.getByText("Attachment couldn't be rendered")).to.be.visible
    })
  })

  describe('log', () => {
    it('renders ANSI characters', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/x.cucumber.log+plain',
        body: '\x1b[30mblack\x1b[37mwhite',
        contentEncoding: AttachmentContentEncoding.IDENTITY,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const data = container.querySelector('pre > span')
      expect(data).to.contain.html(
        '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
      )
      expect(screen.getByRole('button', { name: 'Copy' })).to.be.visible
    })

    it('renders ANSI characters with a name', () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/x.cucumber.log+plain',
        fileName: 'the attachment name',
        body: '\x1b[30mblack\x1b[37mwhite',
        contentEncoding: AttachmentContentEncoding.IDENTITY,
      }
      const { container } = render(<Attachment attachment={attachment} />)
      const data = container.querySelector('pre > span')
      expect(data).to.contain.html(
        '<span style="color:#000">black<span style="color:#AAA">white</span></span>'
      )
    })

    it('copies raw content without ANSI conversion when clicking copy button', async () => {
      const attachment: AttachmentMessage = {
        mediaType: 'text/x.cucumber.log+plain',
        body: '\x1b[30mblack\x1b[37mwhite',
        contentEncoding: AttachmentContentEncoding.IDENTITY,
      }
      render(<Attachment attachment={attachment} />)

      await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

      await waitFor(() => {
        expect(navigator.clipboard.writeText).to.have.been.calledOnceWithExactly(
          '\x1b[30mblack\x1b[37mwhite'
        )
      })
    })
  })

  describe('link', () => {
    it('renders a link', () => {
      const attachment: AttachmentMessage = {
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
      const attachment: AttachmentMessage = {
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
  })
})
