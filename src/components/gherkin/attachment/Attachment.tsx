import * as messages from '@cucumber/messages'
import { AttachmentContentEncoding } from '@cucumber/messages'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// @ts-ignore
import Convert from 'ansi-to-html'
import React, { FC, useCallback, useEffect, useState } from 'react'

import { NavigationButton } from '../../app/NavigationButton.js'
import {
  AttachmentClasses,
  AttachmentProps,
  DefaultComponent,
  useCustomRendering,
} from '../../customise/index.js'
import { attachmentFilename } from '../attachmentFilename.js'
import { ErrorMessage } from '../ErrorMessage.js'
import defaultStyles from './Attachment.module.scss'
import { Image } from './Image.js'
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

const Unknown: FC<AttachmentProps> = ({ attachment }) => {
  const [downloadUrl, setDownloadUrl] = useState<string>()
  useEffect(() => () => cleanupDownloadUrl(downloadUrl), [downloadUrl])
  const filename = attachmentFilename(attachment)
  const onClick = useCallback(() => {
    let href
    if (downloadUrl) {
      href = downloadUrl
    } else {
      const createdUrl = createDownloadUrl(attachment)
      setDownloadUrl(createdUrl)
      href = createdUrl
    }

    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = filename
    anchor.click()
  }, [attachment, filename, downloadUrl])
  return (
    <NavigationButton onClick={onClick}>
      <FontAwesomeIcon icon={faPaperclip} />
      Download {filename}
    </NavigationButton>
  )
}

function createDownloadUrl(attachment: messages.Attachment) {
  console.debug('Creating download url')
  const body =
    attachment.contentEncoding === AttachmentContentEncoding.BASE64
      ? base64Decode(attachment.body)
      : attachment.body
  const bytes = Uint8Array.from<string>(body, (m) => m.codePointAt(0) as number)
  const file = new File([bytes], 'attachment', {
    type: attachment.mediaType,
  })
  return URL.createObjectURL(file)
}

function cleanupDownloadUrl(url?: string) {
  if (url) {
    console.debug('Revoking download url')
    URL.revokeObjectURL(url)
  }
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
