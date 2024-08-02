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
import { Image } from './Image.js'
import { Links } from './Links.js'
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
  } else if (attachment.mediaType == 'text/uri-list') {
    return <Links attachment={attachment} classes={styles} />
  } else if (attachment.mediaType.match(/^text\//)) {
    return <Text attachment={attachment} classes={styles} />
  } else if (attachment.mediaType.match(/^application\/json/)) {
    return <Text attachment={attachment} prettify={prettyJSON} classes={styles} />
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

function prettyJSON(s: string) {
  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch (ignore) {
    return s
  }
}
