import { Attachment } from '@cucumber/messages'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { ErrorMessage } from '../ErrorMessage.js'
import { useText } from './useText.js'

const identity = (s: string) => s

export const Text: FC<{
  attachment: Attachment
  prettify?: (body: string) => string
  classes: AttachmentClasses
}> = ({ attachment, prettify = identity, classes }) => {
  const { title, loading, content, error } = useText(attachment)
  if (loading) {
    return null
  }
  if (error) {
    return (
      <ErrorMessage>
        There was an error when trying to fetch the content for this attachment. Check your browser
        console for more information on what went wrong.
      </ErrorMessage>
    )
  }
  return (
    <details>
      <summary>{title}</summary>
      <pre className={classes.text}>
        <span>{prettify(content)}</span>
      </pre>
    </details>
  )
}
