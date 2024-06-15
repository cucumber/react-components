import * as messages from '@cucumber/messages'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import {
  AttachmentClasses,
  AttachmentProps,
  DefaultComponent,
  useCustomRendering,
} from '../../customise/index.js'
import { ErrorMessage } from '../ErrorMessage.js'
import defaultStyles from './Attachment.module.scss'
import { base64Decode } from './base64Decode.js'
import { Image } from './Image.js'
import { Json } from './Json.js'
import { Log } from './Log.js'
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
    return <Log attachment={attachment} classes={styles} />
  } else if (attachment.mediaType.match(/^text\//)) {
    return text(attachment, (s) => s, false, styles)
  } else if (attachment.mediaType.match(/^application\/json/)) {
    return <Json attachment={attachment} classes={styles} />
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
  return (
    <ErrorBoundary fallback={<ErrorMessage message={`Attachment couldn't be rendered`} />}>
      <ResolvedRenderer {...props} />
    </ErrorBoundary>
  )
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
