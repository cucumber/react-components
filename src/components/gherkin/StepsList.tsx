import React, { FunctionComponent } from 'react'

import styles from './StepsList.module.scss'

export const StepsList: FunctionComponent = ({ children }) => {
  return (
    <ol aria-label="Steps" className={styles.steps}>
      {children}
    </ol>
  )
}
