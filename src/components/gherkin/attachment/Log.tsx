import { Attachment } from '@cucumber/messages'
import Convert from 'ansi-to-html'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { Text } from './Text.js'
import { useText } from './useText.js'

export const Log: FC<{
  attachment: Attachment
  classes: AttachmentClasses
}> = ({ attachment, classes }) => {
  const { title, content } = useText(attachment)
  return <Text title={title} content={prettyANSI(content)} html={true} classes={classes} />
}

function prettyANSI(s: string) {
  return new Convert().toHtml(s)
}
