import * as messages from '@cucumber/messages'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import ciCommitLink from '../../ciCommitLink'

interface IProps {
  ci: messages.Ci
}

export const CICommitLink: React.FunctionComponent<IProps> = ({ ci: ci }) => {
  const commitLink = ciCommitLink(ci)

  if (commitLink && ci.git?.remote) {
    return (
      <>
        <FontAwesomeIcon icon={faLink} />
        <a href={commitLink}>{ci.git.revision.substring(0, 7)}</a>
      </>
    )
  }
  return (
    <>
      <FontAwesomeIcon icon={faLink} /> {ci.git?.revision.substring(0, 7)}
    </>
  )
}
