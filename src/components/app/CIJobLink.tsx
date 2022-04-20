import * as messages from '@cucumber/messages'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface IProps {
  ci: messages.Ci
}

export const CIJobLink: React.FunctionComponent<IProps> = ({ ci: ci }) => {
  if (ci.url && ci.buildNumber) {
    return (
      <>
        <FontAwesomeIcon icon={faLink} />
        Job <a href={ci.url}> {ci.buildNumber}</a>
      </>
    )
  }
  return <></>
}
