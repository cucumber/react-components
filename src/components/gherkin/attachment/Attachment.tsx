import * as messages from '@cucumber/messages'
import Convert from 'ansi-to-html'
import React from 'react'

import {
  AttachmentClasses,
  AttachmentProps,
  DefaultComponent,
  useCustomRendering,
} from '../../customise/index.js'
import defaultStyles from './Attachment.module.scss'
import { base64Decode } from './base64Decode.js'
import { Image } from './Image.js'
import { Text } from './Text.js'
import { Unknown } from './Unknown.js'
import { Video } from './Video.js'

const DefaultRenderer: DefaultComponent<AttachmentProps, AttachmentClasses> = ({
  attachment,
  styles,
}) => {
  if (attachment.mediaType.match(/^image\//)) {
    return <Image attachment={attachment} classes={styles} />
  } else if (attachment.mediaType.match(/^video\//)) {
    return <Video attachment={attachment} />
  } else if (attachment.mediaType == 'text/x.cucumber.log+plain') {
    return text(attachment, prettyANSI, true, styles)
  } else if (attachment.mediaType.match(/^text\//)) {
    return text(attachment, (s) => s, false, styles)
  } else if (attachment.mediaType.match(/^application\/json/)) {
    return text(attachment, prettyJSON, false, styles)
  } else {
    return <Unknown attachment={attachment} />
  }
}

export const Attachment: React.FunctionComponent<AttachmentProps> = (props) => {
  const ResolvedRenderer = useCustomRendering<AttachmentProps, AttachmentClasses>(
    'Attachment',
    defaultStyles,
    DefaultRenderer
  )
  return <ResolvedRenderer {...props} />
}

function text(
  attachment: messages.Attachment,
  prettify: (body: string) => string,
  dangerouslySetInnerHTML: boolean,
  classes: AttachmentClasses
) {
  const body =
    attachment.contentEncoding === 'IDENTITY' ? attachment.body : base64Decode(attachment.body)

  const attachmentTitle = attachment.fileName ?? 'Attached Text (' + attachment.mediaType + ')'

  return (
    <Text
      title={attachmentTitle}
      content={prettify(body)}
      html={dangerouslySetInnerHTML}
      classes={classes}
    />
  )
}

function prettyJSON(s: string) {
  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch (ignore) {
    return s
  }
}

function prettyANSI(s: string) {
  return new Convert().toHtml(s)
}
