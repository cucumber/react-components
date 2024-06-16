import { Attachment } from '@cucumber/messages'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { useText } from './useText.js'

const identity = (s: string) => s

export const Text: FC<{
  attachment: Attachment
  prettify?: (body: string) => string
  classes: AttachmentClasses
}> = ({ attachment, prettify = identity, classes }) => {
  const { title, content } = useText(attachment)
  return (
    <details>
      <summary>{title}</summary>
      <pre className={classes.text}>
        <span>{prettify(content)}</span>
      </pre>
    </details>
  )
}
