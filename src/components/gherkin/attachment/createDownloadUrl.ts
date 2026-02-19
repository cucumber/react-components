import { type Attachment, AttachmentContentEncoding } from '@cucumber/messages'

import { base64DecodeBytes } from './base64Decode.js'

export function createDownloadUrl(attachment: Attachment): string {
  const body =
    attachment.contentEncoding === AttachmentContentEncoding.BASE64
      ? base64DecodeBytes(attachment.body)
      : attachment.body
  const file = new File([body], 'attachment', {
    type: attachment.mediaType,
  })
  return URL.createObjectURL(file)
}
