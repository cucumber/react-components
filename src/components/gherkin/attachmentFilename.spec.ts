import { Attachment, AttachmentContentEncoding } from '@cucumber/messages'
import { expect } from 'chai'

import { attachmentFilename } from './attachmentFilename.js'

describe('attachmentFilename', () => {
  it('should return the filename from the message if present', () => {
    const attachment: Attachment = {
      body: 'foo',
      contentEncoding: AttachmentContentEncoding.BASE64,
      mediaType: 'application/pdf',
      fileName: 'document.pdf',
    }
    expect(attachmentFilename(attachment)).to.eq('document.pdf')
  })

  it('should use the file extension when known from mime type', () => {
    const attachment: Attachment = {
      body: 'foo',
      contentEncoding: AttachmentContentEncoding.BASE64,
      mediaType: 'application/pdf',
    }
    expect(attachmentFilename(attachment)).to.eq('attachment.pdf')
  })

  it("should just return 'attachment' if nothing else to go on", () => {
    const attachment: Attachment = {
      body: 'foo',
      contentEncoding: AttachmentContentEncoding.BASE64,
      mediaType: 'application/something-weird',
    }
    expect(attachmentFilename(attachment)).to.eq('attachment')
  })
})
