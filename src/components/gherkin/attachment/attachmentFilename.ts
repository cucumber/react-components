import type { Attachment } from '@cucumber/messages'
import mimeTypes from 'mime'

export function attachmentFilename(attachment: Attachment): string {
  if (attachment.fileName) {
    return attachment.fileName
  }
  const extension = mimeTypes.getExtension(attachment.mediaType)
  if (extension) {
    return `attachment.${extension}`
  }
  return 'attachment'
}
