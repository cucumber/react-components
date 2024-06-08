import * as messages from '@cucumber/messages'
import { AttachmentContentEncoding } from '@cucumber/messages'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { NavigationButton } from '../../app/NavigationButton.js'
import { AttachmentProps } from '../../customise/index.js'
import { attachmentFilename } from '../attachmentFilename.js'
import { base64Decode } from './base64Decode.js'

export const Unknown: FC<AttachmentProps> = ({ attachment }) => {
  const [downloadUrl, setDownloadUrl] = useState<string>()
  useEffect(() => () => cleanupDownloadUrl(downloadUrl), [downloadUrl])
  const filename = attachmentFilename(attachment)
  const onClick = useCallback(() => {
    let href
    if (downloadUrl) {
      href = downloadUrl
    } else {
      const createdUrl = createDownloadUrl(attachment)
      setDownloadUrl(createdUrl)
      href = createdUrl
    }

    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = filename
    anchor.click()
  }, [attachment, filename, downloadUrl])
  return (
    <NavigationButton onClick={onClick}>
      <FontAwesomeIcon icon={faPaperclip} />
      Download {filename}
    </NavigationButton>
  )
}

function createDownloadUrl(attachment: messages.Attachment) {
  console.debug('Creating download url')
  const body =
    attachment.contentEncoding === AttachmentContentEncoding.BASE64
      ? base64Decode(attachment.body)
      : attachment.body
  const bytes = Uint8Array.from<string>(body, (m) => m.codePointAt(0) as number)
  const file = new File([bytes], 'attachment', {
    type: attachment.mediaType,
  })
  return URL.createObjectURL(file)
}

function cleanupDownloadUrl(url?: string) {
  if (url) {
    console.debug('Revoking download url')
    URL.revokeObjectURL(url)
  }
}
