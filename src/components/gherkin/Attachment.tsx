import React, { FC, useEffect, useState } from 'react'
import * as messages from '@cucumber/messages'
// @ts-ignore
import Convert from 'ansi-to-html'

import {
  AttachmentClasses,
  AttachmentProps,
  DefaultComponent,
  useCustomRendering,
} from '../customise'
import defaultStyles from './Attachment.module.scss'
import { ErrorMessage } from './ErrorMessage'

export const DefaultRenderer: DefaultComponent<AttachmentProps, AttachmentClasses> = ({
  attachment,
  styles,
}) => {
  if (attachment.mediaType.match(/^image\//)) {
    return image(attachment, styles)
  } else if (attachment.mediaType.match(/^video\//)) {
    return video(attachment)
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

const Unknown: FC<AttachmentProps> = ({ attachment }) => {
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    if (attachment.contentEncoding !== 'BASE64') {
      return
    }
    console.log('creating object url')
    const bytes = Uint8Array.from<string>(atob(attachment.body), (m) => m.codePointAt(0) as number)
    const file = new File([bytes], attachment.fileName ?? 'attachment', {
      type: attachment.mediaType,
    })
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => {
      console.log('revoking object url')
      URL.revokeObjectURL(objectUrl)
    }
  }, [attachment])
  if (attachment.contentEncoding !== 'BASE64') {
    return (
      <ErrorMessage
        message={`Couldn't display ${attachment.mediaType} attachment because it wasn't base64 encoded`}
      />
    )
  }
  return (
    <a href={url} download>
      Download
    </a>
  )
}

function image(attachment: messages.Attachment, classes: AttachmentClasses) {
  if (attachment.contentEncoding !== 'BASE64') {
    return (
      <ErrorMessage
        message={`Couldn't display ${attachment.mediaType} image because it wasn't base64 encoded`}
      />
    )
  }

  const attachmentTitle = attachment.fileName ?? 'Attached Image (' + attachment.mediaType + ')'

  return (
    <details>
      <summary>{attachmentTitle}</summary>
      <img
        alt="Embedded Image"
        src={`data:${attachment.mediaType};base64,${attachment.body}`}
        className={classes.image}
      />
    </details>
  )
}

function video(attachment: messages.Attachment) {
  const attachmentTitle = attachment.fileName ?? 'Attached Video (' + attachment.mediaType + ')'

  if (attachment.contentEncoding !== 'BASE64') {
    return (
      <ErrorMessage
        message={`Couldn't display ${attachment.mediaType} video because it wasn't base64 encoded`}
      />
    )
  }
  return (
    <details>
      <summary>{attachmentTitle}</summary>
      <video controls>
        <source src={`data:${attachment.mediaType};base64,${attachment.body}`} />
        Your browser is unable to display video
      </video>
    </details>
  )
}

function base64Decode(body: string) {
  return atob(body)
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

  if (dangerouslySetInnerHTML) {
    return (
      <details>
        <summary>{attachmentTitle}</summary>
        <pre className={classes.text}>
          <span dangerouslySetInnerHTML={{ __html: prettify(body) }} />
        </pre>
      </details>
    )
  }
  return (
    <details>
      <summary>{attachmentTitle}</summary>
      <pre className={classes.text}>
        <span>{prettify(body)}</span>
      </pre>
    </details>
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
