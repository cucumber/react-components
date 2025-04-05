import { faGrimace } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'

import styles from './NoMatchResult.module.scss'

export const NoMatchResult: FC = () => {
  return (
    <p className={styles.message}>
      <FontAwesomeIcon className={styles.icon} aria-hidden="true" icon={faGrimace} />
      <span>No matches found for your query and/or filters</span>
    </p>
  )
}
