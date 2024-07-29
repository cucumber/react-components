import { Attachment } from '@cucumber/messages'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { useText } from './useText.js'

export const Link: FC<{
  attachment: Attachment
  classes: AttachmentClasses
}> = ({ attachment, classes }) => {
  const { content } = useText(attachment)
  return (
    <div>
      <a className={classes.link} href={content} target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faLink} />
        {content}
      </a>
    </div>
  )
}
