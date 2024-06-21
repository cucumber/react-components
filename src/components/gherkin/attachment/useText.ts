import { Attachment } from '@cucumber/messages'
import { useEffect, useState } from 'react'

import { base64Decode } from './base64Decode.js'

export function useText(attachment: Attachment) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(
    attachment.contentEncoding === 'BASE64' ? base64Decode(attachment.body) : attachment.body
  )
  const [error, setError] = useState<Error | string>()
  useEffect(() => {
    if (attachment.url) {
      setLoading(true)
      fetch(attachment.url)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('HTTP error when fetching attachment content')
          }
          return response.text().then((text) => setContent(text))
        })
        .catch((e) => setError(e))
        .finally(() => setLoading(false))
    }
  }, [attachment])
  return {
    title: attachment.fileName ?? 'Attached Text (' + attachment.mediaType + ')',
    loading,
    content,
    error,
  }
}
