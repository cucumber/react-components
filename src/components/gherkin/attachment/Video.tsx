import type * as messages from '@cucumber/messages'
import React, { type FC } from 'react'

import { ErrorMessage } from '../ErrorMessage.js'

export const Video: FC<{ attachment: messages.Attachment }> = ({ attachment }) => {
  const title = attachment.fileName ?? `Attached Video (${attachment.mediaType})`
  if (attachment.url) {
    return <VideoInternal src={attachment.url} title={title} />
  }
  if (attachment.contentEncoding === 'BASE64') {
    return (
      <VideoInternal src={`data:${attachment.mediaType};base64,${attachment.body}`} title={title} />
    )
  }
  return (
    <ErrorMessage
      message={`Couldn't display ${attachment.mediaType} video because it wasn't base64 encoded or externalised`}
    />
  )
}

const VideoInternal: FC<{ src: string; title: string }> = ({ src, title }) => {
  return (
    <details>
      <summary>{title}</summary>
      <video controls>
        <source src={src} />
        Your browser is unable to display video
      </video>
    </details>
  )
}
