import { Attachment } from '@cucumber/messages'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { Text } from './Text.js'
import { useText } from './useText.js'

export const Json: FC<{
  attachment: Attachment
  classes: AttachmentClasses
}> = ({ attachment, classes }) => {
  const { title, content } = useText(attachment)
  return <Text title={title} content={prettyJSON(content)} html={false} classes={classes} />
}

function prettyJSON(s: string) {
  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch (ignore) {
    return s
  }
}
