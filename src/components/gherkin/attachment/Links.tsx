import { Attachment } from '@cucumber/messages'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'

import { AttachmentClasses } from '../../customise/index.js'
import { useText } from './useText.js'

export const Links: FC<{
  attachment: Attachment
  classes: AttachmentClasses
}> = ({ attachment, classes }) => {
  const { content } = useText(attachment)
  return (
    <ul className={classes.links}>
      {content
        .split('\n')
        .filter((line) => !!line)
        .map((line, index) => {
          return (
            <li key={index}>
              <a href={line} target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faLink} />
                {line}
              </a>
            </li>
          )
        })}
    </ul>
  )
}
