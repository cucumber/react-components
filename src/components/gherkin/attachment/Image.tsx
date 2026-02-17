import type { Attachment } from '@cucumber/messages'
import type { FC } from 'react'

import type { AttachmentClasses } from '../../customise/index.js'
import { ErrorMessage } from '../ErrorMessage.js'

export const Image: FC<{ attachment: Attachment; classes: AttachmentClasses }> = ({
  attachment,
  classes,
}) => {
  const title = attachment.fileName ?? `Attached Image (${attachment.mediaType})`
  if (attachment.url) {
    return <ImageInternal src={attachment.url} title={title} className={classes.image} />
  }
  if (attachment.contentEncoding === 'BASE64') {
    return (
      <ImageInternal
        src={`data:${attachment.mediaType};base64,${attachment.body}`}
        title={title}
        className={classes.image}
      />
    )
  }
  return (
    <ErrorMessage
      message={`Couldn't display ${attachment.mediaType} image because it wasn't base64 encoded or externalised`}
    />
  )
}

const ImageInternal: FC<{
  src: string
  title: string
  className: string
}> = ({ src, title, className }) => {
  return (
    <details>
      <summary>{title}</summary>
      <img alt="" src={src} className={className} />
    </details>
  )
}
