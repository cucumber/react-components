import { Attachment } from '@cucumber/messages'
import Convert from 'ansi-to-html'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { useText } from './useText.js'

export const Log: FC<{
  attachment: Attachment
  classes: AttachmentClasses
}> = ({ attachment, classes }) => {
  const { content } = useText(attachment)
  return (
    <pre className={`${classes.text} ${classes.log}`}>
      <span dangerouslySetInnerHTML={{ __html: prettyANSI(content) }} />
    </pre>
  )
}

function prettyANSI(s: string) {
  return new Convert().toHtml(s)
}
