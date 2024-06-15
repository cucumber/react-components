import { Attachment } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import { base64Decode } from './base64Decode.js'

export function useText(attachment: Attachment) {
  const [content, setContent] = useState(
    attachment.contentEncoding === 'BASE64' ? base64Decode(attachment.body) : attachment.body
  )
  useEffect(() => {
    if (attachment.url) {
      fetch(attachment.url).then((response) => response.text().then(setContent))
    }
  }, [attachment])
  return {
    title: attachment.fileName ?? 'Attached Text (' + attachment.mediaType + ')',
    content,
  }
}
