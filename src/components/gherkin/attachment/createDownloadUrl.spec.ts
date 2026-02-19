import { AttachmentContentEncoding, type Attachment as AttachmentMessage } from '@cucumber/messages'
import { expect } from 'chai'
import sinon from 'sinon'

import { createDownloadUrl } from './createDownloadUrl.js'

describe('createDownloadUrl', () => {
  let capturedFile: File | undefined

  beforeEach(() => {
    capturedFile = undefined
    sinon.stub(URL, 'createObjectURL').callsFake((obj) => {
      capturedFile = obj as File
      return 'blob:mock-url'
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('returns the URL produced by URL.createObjectURL', () => {
    const attachment: AttachmentMessage = {
      body: 'hello',
      mediaType: 'text/plain',
      contentEncoding: AttachmentContentEncoding.IDENTITY,
    }
    const url = createDownloadUrl(attachment)
    expect(url).to.eq('blob:mock-url')
  })

  it('sets the correct media type on the created File', () => {
    const attachment: AttachmentMessage = {
      body: Buffer.from('data').toString('base64'),
      mediaType: 'application/pdf',
      contentEncoding: AttachmentContentEncoding.BASE64,
    }
    createDownloadUrl(attachment)
    expect(capturedFile?.type).to.eq('application/pdf')
  })

  it('encodes IDENTITY text content as UTF-8 bytes', async () => {
    const attachment: AttachmentMessage = {
      body: 'hello',
      mediaType: 'text/plain',
      contentEncoding: AttachmentContentEncoding.IDENTITY,
    }
    createDownloadUrl(attachment)
    const buffer = await capturedFile!.arrayBuffer()
    expect(new TextDecoder().decode(new Uint8Array(buffer))).to.eq('hello')
  })

  it('produces byte-accurate content for BASE64 ASCII attachment', async () => {
    const original = Buffer.from('hello')
    const attachment: AttachmentMessage = {
      body: original.toString('base64'),
      mediaType: 'application/octet-stream',
      contentEncoding: AttachmentContentEncoding.BASE64,
    }
    createDownloadUrl(attachment)
    const buffer = await capturedFile!.arrayBuffer()
    expect(Array.from(new Uint8Array(buffer))).to.deep.eq(Array.from(original))
  })

  it('produces byte-accurate content for BASE64 binary attachment with bytes > 127', async () => {
    // Critical regression test: a Unicode-aware decoder would corrupt these bytes.
    // 0xC3 0xA9 is the UTF-8 encoding of é — as raw binary they must survive byte-for-byte.
    const originalBytes = new Uint8Array([0xc3, 0xa9, 0x00, 0xff, 0x80, 0xfe])
    const attachment: AttachmentMessage = {
      body: Buffer.from(originalBytes).toString('base64'),
      mediaType: 'application/octet-stream',
      contentEncoding: AttachmentContentEncoding.BASE64,
    }
    createDownloadUrl(attachment)
    const buffer = await capturedFile!.arrayBuffer()
    expect(Array.from(new Uint8Array(buffer))).to.deep.eq(Array.from(originalBytes))
  })
})
