import { Ci } from '@cucumber/messages'
import { faCodeCommit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'

import ciCommitLink from '../../ciCommitLink.js'

export const CICommitLink: FC<{
  ci: Ci
}> = ({ ci }) => {
  if (!ci.git) {
    return null
  }

  const shortHash = ci.git.revision.substring(0, 7)
  const commitLink = ciCommitLink(ci)

  if (commitLink) {
    return (
      <>
        <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faCodeCommit} />
        <a href={commitLink} target="_blank" rel="noopener nofollow noreferrer">
          <code>{shortHash}</code>
        </a>
      </>
    )
  }
  return (
    <>
      <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faCodeCommit} />
      <code>{shortHash}</code>
    </>
  )
}
