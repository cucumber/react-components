import type { Attachment } from '@cucumber/messages'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { FC } from 'react'

import type { AttachmentClasses } from '../../customise/index.js'
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
              <a href={line} target="_blank" rel="noopener nofollow noreferrer">
                <FontAwesomeIcon icon={faLink} />
                {line}
              </a>
            </li>
          )
        })}
    </ul>
  )
}
