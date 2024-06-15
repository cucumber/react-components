import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'

export const Text: FC<{
  title: string
  content: string
  html: boolean
  classes: AttachmentClasses
}> = ({ title, content, html, classes }) => {
  return (
    <details>
      <summary>{title}</summary>
      <pre className={classes.text}>
        {html ? <span dangerouslySetInnerHTML={{ __html: content }} /> : <span>{content}</span>}
      </pre>
    </details>
  )
}
