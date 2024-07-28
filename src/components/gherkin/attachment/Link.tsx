import { Attachment } from '@cucumber/messages'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { useText } from './useText.js'

export const Link: FC<{
  attachment: Attachment
  classes: AttachmentClasses
}> = ({ attachment }) => {
  const { content } = useText(attachment)
  const name = attachment.fileName || content
  return (
    <div>
      <a href={content}>{name}</a>
    </div>
  )
}
