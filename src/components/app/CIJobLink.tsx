import type { Ci } from '@cucumber/messages'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { type FC } from 'react'

export const CIJobLink: FC<{
  ci: Ci
}> = ({ ci }) => {
  if (ci.url) {
    return (
      <>
        <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faServer} />
        <a href={ci.url} target="_blank" rel="noopener nofollow noreferrer">
          {ci.name}
        </a>
      </>
    )
  }
  return (
    <>
      <FontAwesomeIcon aria-hidden="true" style={{ opacity: 0.75 }} icon={faServer} />
      <span>{ci.name}</span>
    </>
  )
}
