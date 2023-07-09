import { Attachment } from '@cucumber/messages'
import mimeTypes from 'mime-types'

export function attachmentFilename(attachment: Attachment): string {
  if (attachment.fileName) {
    return attachment.fileName
  }
  const extension = mimeTypes.extension(attachment.mediaType)
  if (extension) {
    return `attachment.${extension}`
  }
  return 'attachment'
}
