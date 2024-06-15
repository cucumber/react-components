import { Attachment } from '@cucumber/messages'

import { base64Decode } from './base64Decode.js'

export function useText(attachment: Attachment) {
  return {
    title: attachment.fileName ?? 'Attached Text (' + attachment.mediaType + ')',
    content:
      attachment.contentEncoding === 'IDENTITY' ? attachment.body : base64Decode(attachment.body),
  }
}
